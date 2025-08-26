import React, { useState, useMemo } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/shadcn/resizable";
import { Button } from "@/components/shadcn/button";
import { GardenTreeView } from "./GardenTreeView";
import { useGetGardens } from "../gardens/api/useGetGardens";
import { useGetGarden } from "../gardens/api/useGetGarden";
import { useGetModalFunction } from "../modal/api/useGetModalFunction";
import { useGetUserInfo } from "../users/api/useGetUserInfo";
import { useSavedGardens } from "../users/api/useSavedGardens";
import { useGetModelDeployments } from "../model-deployments/api/useGetModelDeployments";
import { useGetUserModalFunctions } from "../modal/api/useGetUserModalFunctions";

import { DndContext } from "@dnd-kit/core";
import { Garden, ModalFunction } from "@/types";
import { ModelDeployment } from "../model-deployments/ModelDeployments";
import { ModelDeploymentDetails } from "../model-deployments/ModelDeploymentDetails";
import { GardenMetadataSidebar } from "../gardens/components/GardenMetadataSidebar";
import { FunctionSidebar } from "../modal/components/FunctionSidebar";
import { useGlobusAuth } from "@globus/react-auth-context";
import { SUPER_USERS } from "@/utils/utils";
import ModalAssociatedMaterials from "../materials/components/ModalAssociatedMaterials";
import { MaterialsProvider } from "../materials/contexts/MaterialsContext";
import {
  ModalFunctionHeader,
  ModalFunctionBody,
  ModalFunctionExample,
} from "../modal/components/ModalFunctionPage";
import {
  GardenHeader,
  GardenContentView,
  GardenPublishModal,
} from "../gardens/components/shared/GardenComponents";
import TombstonePage from "@/components/TombstonePage";
import { ChevronDown, ChevronRight, Plus, Library, User, LogOut, Bookmark, Globe, Sprout } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Input } from "@/components/shadcn/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { ModalAppForm } from "../modal/components/ModalAppForm";

type Entity = Garden | ModalFunction | ModelDeployment;

export const UnifiedManagmentInterface = () => {
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const auth = useGlobusAuth();

  const hanldeItemSelected = (entity: Entity) => {
    setSelectedItem(entity);
  };

  return (
    <DndContext>
      <div className="relative flex h-screen w-full items-center bg-gray-100 p-2 scrollbar-thin scrollbar-track-transparent overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="rounded-lg overflow-hidden shadow-sm">
          <LeftSidePanel onItemSelected={hanldeItemSelected} selectedItem={selectedItem} />
          <ResizableHandle withHandle className="bg-slate-200 hover:bg-slate-300 transition-colors w-1" />
          <MainContentPanel entity={selectedItem ?? null} auth={auth} />
          <ResizableHandle withHandle className="bg-slate-200 hover:bg-slate-300 transition-colors w-1" />
          <RightSidePanel entity={selectedItem ?? null} auth={auth} onItemSelected={hanldeItemSelected} />
        </ResizablePanelGroup>
      </div>
    </DndContext>
  );
};

type MainContentPanelProps = {
  entity: Garden | ModalFunction | ModelDeployment | null;
  auth: ReturnType<typeof useGlobusAuth>;
};

const MainContentPanel = ({ entity, auth }: MainContentPanelProps) => {
  const entityType = ((entity) => {
    if (entity === null) return null;

    // Check if it's a Garden (has doi and modal_functions)
    if ("doi" in entity && "modal_functions" in entity) {
      return "garden";
    }

    // Check if it's a ModelDeployment (has originalData property)
    if ("originalData" in entity && "status" in entity) {
      return "deployment";
    }

    // Check if it's a ModalFunction (has function_name or title, and id)
    if (("function_name" in entity || "title" in entity) && "id" in entity) {
      return "function";
    }

    // Fallback - shouldn't happen
    return null;
  })(entity);

  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity =
    auth?.isAuthenticated &&
    ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub ||
      isSuperUser);

  // For gardens, fetch fresh data to ensure metadata is up to date
  const gardenEntity = entityType === "garden" ? (entity as Garden) : null;
  const { data: freshGarden } = useGetGarden(gardenEntity?.doi || "");
  const currentGarden = gardenEntity && (freshGarden || gardenEntity);

  // For functions, fetch fresh data to ensure metadata is up to date
  const functionEntity = entityType === "function" ? (entity as ModalFunction) : null;
  const { data: freshModalFunction } = useGetModalFunction(functionEntity?.id.toString() || "");
  const currentModalFunction = functionEntity && (freshModalFunction || functionEntity);

  return (
    <ResizablePanel minSize={25} defaultSize={40} className="flex flex-col bg-white">
      {entityType === null ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-4xl">🌿</div>
            <p className="text-gray-500 font-medium">Select a Garden, Function, or App</p>
            <p className="text-sm text-gray-400">Choose from the left panel to get started</p>
          </div>
        </div>
      ) : (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent">
          {entityType === "function" ? (
            <UnifiedFunctionContent
              modalFunction={entity as ModalFunction}
              ownsThisFunction={ownsEntity}
            />
          ) : entityType === "garden" ? (
            <UnifiedGardenContent garden={entity as Garden} ownsThisGarden={ownsEntity} />
          ) : entityType === "deployment" ? (
            <ModelDeploymentDetails entity={(entity as ModelDeployment).originalData} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Unknown entity type</p>
            </div>
          )}
        </div>
      )}
    </ResizablePanel>
  );
};

type LeftSidePanelProps = {
  onItemSelected?: (entity: Entity) => void;
  selectedItem?: Entity | null;
};

const LeftSidePanel = ({ onItemSelected, selectedItem }: LeftSidePanelProps) => {
  const auth = useGlobusAuth();
  const { data: userInfo } = useGetUserInfo();
  const { data: gardens, refetch: refetchGardens } = useGetGardens({
    owner_uuid: userInfo?.identity_id,
  });
  const { data: modelDeployments } = useGetModelDeployments();
  
  // Get saved gardens from user's saved DOIs
  const savedGardenDois = userInfo?.saved_garden_dois || [];
  const { data: savedGardensResponse } = useSavedGardens(savedGardenDois);
  const savedGardens = savedGardensResponse?.garden_meta || [];

  const handleGardenCreated = () => {
    refetchGardens();
  };

  // Only show gardens if user is authenticated and has an identity_id
  const filteredGardens = auth.isAuthenticated && userInfo?.identity_id ? gardens || [] : [];

  return (
    <ResizablePanel defaultSize={20} minSize={20} maxSize={33} className="bg-emerald-50 rounded-l-lg">
      <ResizablePanelGroup direction="vertical">
        {/* Saved Gardens Panel */}
        <ResizablePanel defaultSize={33} minSize={20}>
          <SavedGardensPanel
            savedGardens={savedGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-emerald-200 hover:bg-emerald-300 transition-colors h-1" />
        
        {/* My Gardens Panel */}
        <ResizablePanel defaultSize={34} minSize={20}>
          <MyGardensPanel
            gardens={filteredGardens}
            onSelect={onItemSelected}
            onGardenCreated={handleGardenCreated}
            selectedItem={selectedItem}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-emerald-200 hover:bg-emerald-300 transition-colors h-1" />
        
        {/* My Function Library Panel */}
        <ResizablePanel defaultSize={33} minSize={20}>
          <MyFunctionLibraryView
            modelDeployments={modelDeployments || []}
            gardens={filteredGardens}
            onSelect={onItemSelected}
            selectedItem={selectedItem}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

const RightSidePanel = ({
  entity,
  auth,
  onItemSelected,
}: {
  entity: Entity | null;
  auth: ReturnType<typeof useGlobusAuth>;
  onItemSelected?: (entity: Entity) => void;
}) => {
  const { data: userInfo } = useGetUserInfo();

  return (
    <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="flex h-full flex-col bg-green-50 rounded-r-lg">
      <UserInfoPanel auth={auth} userInfo={userInfo} />
      <ResizablePanelGroup direction="vertical" className="flex-1">
        {/* Metadata Panel */}
        <ResizablePanel defaultSize={40} minSize={20}>
          <MetadataPanel entity={entity} />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-green-200 hover:bg-green-300 transition-colors h-1" />
        
        {/* Published Gardens Panel */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <PublishedGardensPanel
            onSelect={onItemSelected}
            selectedItem={entity}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
};

// Metadata Panel - shows metadata for selected entity
type MetadataPanelProps = {
  entity: Entity | null;
};

const MetadataPanel = ({ entity }: MetadataPanelProps) => {
  const auth = useGlobusAuth();

  if (!entity) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <div className="border-b-2 border-slate-300 bg-slate-100">
          <div className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Library className="h-4 w-4 text-slate-700" />
              <h2 className="text-sm font-semibold text-slate-900">Metadata</h2>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <Library className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500">Select an item to view metadata</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine entity type and get fresh data
  const entityType = (() => {
    if ("doi" in entity && "modal_functions" in entity) return "garden";
    if ("originalData" in entity && "status" in entity) return "deployment";  
    if (("function_name" in entity || "title" in entity) && "id" in entity) return "function";
    return null;
  })();

  // For gardens, fetch fresh data
  const gardenEntity = entityType === "garden" ? (entity as Garden) : null;
  const { data: freshGarden } = useGetGarden(gardenEntity?.doi || "");
  const currentGarden = gardenEntity && (freshGarden || gardenEntity);

  // For functions, fetch fresh data
  const functionEntity = entityType === "function" ? (entity as ModalFunction) : null;
  const { data: freshModalFunction } = useGetModalFunction(functionEntity?.id.toString() || "");
  const currentModalFunction = functionEntity && (freshModalFunction || functionEntity);

  // Check ownership
  const isSuperUser = SUPER_USERS.includes(auth?.authorization?.user?.sub);
  const ownsEntity = auth?.isAuthenticated &&
    ((entity as Garden | ModalFunction)?.owner_identity_id === auth?.authorization?.user?.sub || isSuperUser);

  // For garden and function metadata, don't show custom header since components have their own
  if (entityType === "garden" && currentGarden) {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3 bg-slate-50">
        <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
          <GardenMetadataSidebar garden={currentGarden} ownsThisGarden={ownsEntity} />
        </div>
      </div>
    );
  }

  if (entityType === "function" && currentModalFunction) {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3 bg-slate-50">
        <div className="w-full [&>*]:!w-full [&>*]:!max-w-full">
          <FunctionSidebar modalFunction={currentModalFunction} ownsThisFunction={ownsEntity} />
        </div>
      </div>
    );
  }

  // For deployments and other types, show custom header
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="border-b-2 border-slate-300 bg-slate-100">
        <div className="px-4 py-2">
          <div className="flex items-center gap-2">
            <Library className="h-4 w-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-900">Deployment Details</h2>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent p-3">
        {entityType === "deployment" ? (
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Deployment Information</h3>
            <p className="text-slate-600">App: {(entity as ModelDeployment).name}</p>
            <p className="text-slate-600">Status: {(entity as ModelDeployment).status}</p>
            <p className="text-slate-600">Type: {(entity as ModelDeployment).type}</p>
          </div>
        ) : (
          <div className="text-center text-slate-500 text-sm">
            Unable to load metadata
          </div>
        )}
      </div>
    </div>
  );
};

// Unified content components without sidebars
const UnifiedGardenContent = ({
  garden,
  ownsThisGarden,
}: {
  garden: Garden;
  ownsThisGarden: boolean;
}) => {
  const [isPublishGardenModalOpen, setIsPublishGardenModalOpen] = React.useState(false);

  // Fetch fresh garden data to ensure updates are reflected
  const { data: freshGarden, refetch } = useGetGarden(garden.doi);

  // Use fresh data if available, fallback to prop
  const currentGarden = freshGarden || garden;

  const memoizedRefetch = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Show tombstone page for archived gardens
  if (currentGarden.is_archived) {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent">
        <TombstonePage garden={currentGarden} />
      </div>
    );
  }

  return (
    <MaterialsProvider garden={currentGarden} refetchGarden={memoizedRefetch}>
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-6">
        <div className="mb-6">
          <GardenHeader
            garden={currentGarden}
            ownsThisGarden={ownsThisGarden}
            setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
          />

          <GardenContentView garden={currentGarden} ownsThisGarden={ownsThisGarden} />
        </div>

        <GardenPublishModal
          garden={currentGarden}
          isPublishGardenModalOpen={isPublishGardenModalOpen}
          setIsPublishGardenModalOpen={setIsPublishGardenModalOpen}
        />
      </div>
    </MaterialsProvider>
  );
};

const UnifiedFunctionContent = ({
  modalFunction,
  ownsThisFunction,
}: {
  modalFunction: ModalFunction;
  ownsThisFunction: boolean;
}) => {
  // Fetch fresh modal function data to ensure updates are reflected
  const { data: freshModalFunction } = useGetModalFunction(modalFunction.id.toString());

  // Use fresh data if available, fallback to prop
  const currentModalFunction = freshModalFunction || modalFunction;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent p-6">
      <ModalFunctionHeader
        modalFunction={currentModalFunction}
        ownsThisFunction={ownsThisFunction}
      />
      <ModalFunctionBody modalFunction={currentModalFunction} ownsThisFunction={ownsThisFunction} />
      <ModalFunctionExample
        modalFunction={currentModalFunction}
        ownsThisFunction={ownsThisFunction}
      />
      <ModalAssociatedMaterials
        resource={currentModalFunction}
        ownsThisFunction={ownsThisFunction}
      />
    </div>
  );
};

// Saved Gardens Panel - wraps GardenTreeView with saved gardens
type SavedGardensPanelProps = {
  savedGardens: Garden[];
  onSelect?: (entity: Entity) => void;
  selectedItem?: Entity | null;
};

const SavedGardensPanel = ({ savedGardens, onSelect, selectedItem }: SavedGardensPanelProps) => {
  return (
    <div className="h-full bg-amber-50">
      <GardenTreeView
        gardens={savedGardens}
        onSelect={onSelect}
        selectedItem={
          selectedItem && ("doi" in selectedItem || "function_name" in selectedItem)
            ? (selectedItem as Garden | ModalFunction)
            : null
        }
        showHeader={true}
        headerIcon={<Bookmark className="h-4 w-4" />}
        headerTitle={`Saved Gardens (${savedGardens.length})`}
        headerThemeColors={{
          bg: "bg-amber-100",
          border: "border-amber-300",
          text: "text-amber-900",
          iconColor: "text-amber-700",
          hoverColor: "hover:bg-amber-200",
          activeColor: "bg-amber-200"
        }}
      />
    </div>
  );
};

// My Gardens Panel - wraps GardenTreeView with user's gardens
type MyGardensPanelProps = {
  gardens: Garden[];
  onSelect?: (entity: Entity) => void;
  onGardenCreated?: (garden: Garden) => void;
  selectedItem?: Entity | null;
};

const MyGardensPanel = ({ gardens, onSelect, onGardenCreated, selectedItem }: MyGardensPanelProps) => {
  return (
    <div className="h-full">
      <GardenTreeView
        gardens={gardens}
        onSelect={onSelect}
        onGardenCreated={onGardenCreated}
        selectedItem={
          selectedItem && ("doi" in selectedItem || "function_name" in selectedItem)
            ? (selectedItem as Garden | ModalFunction)
            : null
        }
        showHeader={true}
        headerIcon={<Sprout className="h-4 w-4" />}
        headerTitle="My Gardens"
        headerThemeColors={{
          bg: "bg-emerald-100",
          border: "border-emerald-300",
          text: "text-emerald-900", 
          iconColor: "text-emerald-700",
          hoverColor: "hover:bg-emerald-200",
          activeColor: "bg-emerald-200"
        }}
      />
    </div>
  );
};

// Published Gardens Panel - wraps GardenTreeView with published gardens
type PublishedGardensPanelProps = {
  onSelect?: (entity: Entity) => void;
  selectedItem?: Entity | null;
};

const PublishedGardensPanel = ({ onSelect, selectedItem }: PublishedGardensPanelProps) => {
  // Fetch published gardens (non-draft)
  const { data: publishedGardens } = useGetGardens({ 
    draft: false,
    limit: 100
  });

  return (
    <div className="h-full flex-1">
      <GardenTreeView
        gardens={publishedGardens || []}
        onSelect={onSelect}
        selectedItem={
          selectedItem && ("doi" in selectedItem || "function_name" in selectedItem)
            ? (selectedItem as Garden | ModalFunction)
            : null
        }
        showHeader={true}
        headerIcon={<Globe className="h-4 w-4" />}
        headerTitle={`Published Gardens${publishedGardens ? ` (${publishedGardens.length})` : ''}`}
        headerThemeColors={{
          bg: "bg-green-100",
          border: "border-green-300",
          text: "text-green-900",
          iconColor: "text-green-700",
          hoverColor: "hover:bg-green-200",
          activeColor: "bg-green-200"
        }}
      />
    </div>
  );
};

// User Info Panel - shows logged in user information
type UserInfoPanelProps = {
  auth: ReturnType<typeof useGlobusAuth>;
  userInfo: any; // Replace with proper type when available
};

const UserInfoPanel = ({ auth, userInfo }: UserInfoPanelProps) => {
  if (!auth.isAuthenticated || !userInfo) {
    return (
      <div className="border-b border-slate-300 bg-slate-100 p-3">
        <div className="flex items-center gap-2 text-slate-600">
          <User className="h-4 w-4" />
          <span className="text-sm">Not logged in</span>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    auth.authorization?.logout();
  };

  return (
    <div className="border-b border-slate-300 bg-slate-100 p-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
          <User className="h-4 w-4 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800 truncate">
            {userInfo.name || userInfo.preferred_username || 'User'}
          </div>
          <div className="text-xs text-slate-600 truncate">
            {userInfo.email || 'No email available'}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-slate-200"
                onClick={handleSignOut}
              >
                <LogOut className="h-3 w-3 text-slate-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

// Function Library component - shows functions organized by their source deployment
// Extended function type with deployment info
type FunctionWithDeployment = ModalFunction & {
  deploymentId: number;
  deploymentName: string;
  deploymentStatus: string;
};

type FunctionLibraryViewProps = {
  modelDeployments: ModelDeployment[];
  gardens: Garden[];
  onSelect?: (entity: Entity) => void;
  selectedItem?: Entity | null;
};


// My Function Library component - shows user's functions grouped by deployments
const MyFunctionLibraryView = ({
  modelDeployments,
  gardens,
  onSelect,
  selectedItem,
}: FunctionLibraryViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const auth = useGlobusAuth();
  const { data: userModalFunctions } = useGetUserModalFunctions();

  const handleCreateClick = async () => {
    if (!auth.isAuthenticated) {
      await auth.authorization?.login();
      return;
    }
    setShowCreateDialog(true);
  };

  // Get functions that are already in gardens for badge indicators
  const functionsInGardens = useMemo(() => {
    const inGardens = new Set();
    gardens.forEach((garden) => {
      garden.modal_functions?.forEach((func) => {
        inGardens.add(func.id);
      });
    });
    return inGardens;
  }, [gardens]);

  // Get the set of user's function IDs
  const userFunctionIds = useMemo(() => {
    if (!userModalFunctions) return new Set();
    return new Set(userModalFunctions.map(func => func.id));
  }, [userModalFunctions]);

  // Group deployments with user's functions, filtered by search
  const deploymentGroups = useMemo(() => {
    const groups = new Map();

    // Filter deployments that have user's functions
    modelDeployments.forEach((deployment) => {
      const functions = (deployment.originalData?.modal_functions || [])
        .filter((func: ModalFunction) => userFunctionIds.has(func.id)) // Only show user's functions
        .map((func: ModalFunction) => ({
          ...func,
          deploymentId: deployment.id,
          deploymentName: deployment.name,
          deploymentStatus: deployment.status,
          inGarden: functionsInGardens.has(func.id),
        }));

      // Apply search filter
      const filteredFunctions = functions.filter(
        (func: FunctionWithDeployment & { inGarden: boolean }) => {
          if (!searchTerm) return true;
          const searchLower = searchTerm.toLowerCase();
          return (
            func.function_name?.toLowerCase().includes(searchLower) ||
            func.title?.toLowerCase().includes(searchLower) ||
            func.description?.toLowerCase().includes(searchLower) ||
            func.deploymentName.toLowerCase().includes(searchLower)
          );
        },
      );

      // Only include groups that have functions (after filtering)
      if (filteredFunctions.length > 0) {
        groups.set(deployment.id, {
          deployment,
          functions: filteredFunctions,
        });
      }
    });

    return Array.from(groups.values());
  }, [modelDeployments, searchTerm, functionsInGardens, userFunctionIds]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b-2 border-blue-300 bg-blue-100">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Library className="h-4 w-4 text-blue-700" />
              <h2 className="text-sm font-semibold text-blue-900">My Function Library</h2>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:bg-blue-200"
                    onClick={handleCreateClick}
                  >
                    <Plus className="h-3 w-3 text-blue-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create New Function</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-blue-200 p-2">
        <Input
          placeholder="Search my functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-xs"
        />
      </div>

      {/* Deployment Groups */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent">
        {deploymentGroups.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 p-4 text-center">
            <Library className="h-8 w-8 text-gray-300" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">No Functions Found</h3>
              <p className="text-xs text-gray-500">
                {searchTerm
                  ? "No functions match your search"
                  : "You haven't created any functions yet"}
              </p>
            </div>
            {!searchTerm && (
              <Button onClick={handleCreateClick} className="bg-blue-600 hover:bg-blue-700 text-xs">
                <Plus className="mr-1 h-3 w-3" />
                Create Function
              </Button>
            )}
          </div>
        ) : (
          deploymentGroups.map((group) => (
            <DeploymentGroup
              key={group.deployment.id}
              deployment={group.deployment}
              functions={group.functions}
              onSelect={onSelect}
              selectedItem={selectedItem}
            />
          ))
        )}
      </div>

      {/* Create Function Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-h-[90vh] w-[95%] max-w-4xl overflow-y-auto md:w-4/5 lg:w-3/4">
          <DialogHeader>
            <DialogTitle>Create New Function</DialogTitle>
          </DialogHeader>
          <ModalAppForm onSuccess={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component for displaying a deployment group with its functions
type DeploymentGroupProps = {
  deployment: ModelDeployment;
  functions: Array<FunctionWithDeployment & { inGarden: boolean }>;
  onSelect?: (entity: Entity) => void;
  selectedItem?: Entity | null;
};

const DeploymentGroup = ({
  deployment,
  functions,
  onSelect,
  selectedItem,
}: DeploymentGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getDeploymentStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return "🟢";
      case "error":
        return "🔴";
      case "undeployed":
      default:
        return "🟡";
    }
  };

  const getDeploymentStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "undeployed":
      default:
        return "border-yellow-200 bg-yellow-50";
    }
  };

  const functionsInGardens = functions.filter((f) => f.inGarden).length;

  // Check if this deployment is selected
  const isDeploymentSelected =
    selectedItem &&
    "originalData" in selectedItem &&
    "status" in selectedItem &&
    selectedItem.id === deployment.id;

  const handleDeploymentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(deployment);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`border-b border-gray-200 ${getDeploymentStatusColor(deployment.status)}`}>
      {/* Deployment Header */}
      <div className="flex">
        {/* Expand/Collapse button */}
        <button
          className="flex items-center px-2 py-2 transition-colors hover:bg-gray-100"
          onClick={handleExpandClick}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Deployment info - clickable to select deployment */}
        <div
          className={`flex-1 cursor-pointer px-1 py-2 transition-colors ${
            isDeploymentSelected
              ? "border-r-4 border-purple-400 bg-purple-100"
              : "hover:bg-gray-100"
          }`}
          onClick={handleDeploymentClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs">{getDeploymentStatusIcon(deployment.status)}</span>
              <span className="text-sm font-medium text-gray-800">{deployment.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {functionsInGardens > 0 && (
                <span className="text-green-600 bg-green-100 rounded px-2 py-1 text-xs">
                  {functionsInGardens} in gardens
                </span>
              )}
              <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-500">
                {functions.length} function{functions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Function List */}
      {isExpanded && (
        <div className="px-2 pb-2">
          <div className="space-y-1">
            {functions.map((func) => (
              <FunctionItem
                key={func.id}
                func={func}
                onSelect={onSelect}
                selectedItem={selectedItem}
                showInGardenBadge={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Individual function item component
type FunctionItemProps = {
  func: FunctionWithDeployment & { inGarden?: boolean };
  onSelect?: (entity: Entity) => void;
  selectedItem?: Entity | null;
  showInGardenBadge?: boolean;
};

const FunctionItem = ({
  func,
  onSelect,
  selectedItem,
  showInGardenBadge = false,
}: FunctionItemProps) => {
  const isSelected =
    selectedItem &&
    "id" in selectedItem &&
    selectedItem.id === func.id &&
    ("function_name" in selectedItem || "title" in selectedItem);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(func as ModalFunction);
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={`
        group cursor-pointer rounded p-2 transition-all duration-150
        ${
          isSelected
            ? "border-2 border-blue-400 bg-blue-100 shadow-sm"
            : "border border-transparent hover:bg-white hover:shadow-sm"
        }
      `}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <div className="truncate text-sm font-medium text-gray-900">
              {func.function_name || func.title}
            </div>
            {showInGardenBadge && func.inGarden && (
              <span className="flex-shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-600">
                ✓ in garden
              </span>
            )}
          </div>
          {func.description && (
            <div className="line-clamp-2 text-xs text-gray-500">{func.description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

