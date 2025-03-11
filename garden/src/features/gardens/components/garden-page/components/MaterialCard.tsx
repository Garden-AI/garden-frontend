import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Edit2, Trash2 } from "lucide-react";
import { ExtendedGarden } from "@/types/garden.types";
import { MaterialType, ModalFunctionWithOwner, useMaterialActions } from "../hooks/useMaterialActions";
import { EditDialog } from "./MaterialDialogs";
import { RemoveDialog } from "./MaterialDialogs";

export interface BaseMaterialCardProps<T extends MaterialType> {
  material: T;
  materialType: 'paper' | 'dataset' | 'repository' | 'notebook';
  isOwner: boolean;
  garden: ExtendedGarden;
  findAffectedFunctions?: (doi: string) => ModalFunctionWithOwner[];
  onUpdate?: () => Promise<void>;
  icon: ReactNode;
  title: string;
  onEdit: (updatedMaterial: T) => void;
  children: ReactNode;
  onEditClick: () => void;
  
  // Optional dialog-related props - if provided, will be used instead of useMaterialActions
  isSelectiveEditing?: boolean;
  setIsSelectiveEditing?: (value: boolean) => void;
  editAffectedFunctions?: ModalFunctionWithOwner[];
  editSelectiveFunctions?: Record<number, boolean>;
  applyEditToAllFunctions?: () => Promise<void>;
  applySelectiveEdit?: () => Promise<void>;
  toggleEditFunction?: (id: number) => void;
  toggleEditAll?: (value: boolean) => void;
  confirmRemove?: boolean;
  setConfirmRemove?: (value: boolean) => void;
  prepareFunctionsForRemoval?: () => void;
  affectedFunctions?: ModalFunctionWithOwner[];
  selectiveFunctions?: Record<number, boolean>;
  isSelectiveRemoval?: boolean;
  setIsSelectiveRemoval?: (value: boolean) => void;
  handleRemoveAll?: () => Promise<void>;
  handleSelectiveRemove?: () => Promise<void>;
  toggleFunction?: (id: number) => void;
  toggleAll?: (value: boolean) => void;
}

export function BaseMaterialCard<T extends MaterialType>({
  material,
  materialType,
  isOwner,
  garden,
  findAffectedFunctions,
  onUpdate,
  icon,
  title,
  onEdit,
  children,
  onEditClick,
  // Optional dialog-related props
  isSelectiveEditing: propIsSelectiveEditing,
  setIsSelectiveEditing: propSetIsSelectiveEditing,
  editAffectedFunctions: propEditAffectedFunctions,
  editSelectiveFunctions: propEditSelectiveFunctions, 
  applyEditToAllFunctions: propApplyEditToAllFunctions,
  applySelectiveEdit: propApplySelectiveEdit,
  toggleEditFunction: propToggleEditFunction,
  toggleEditAll: propToggleEditAll,
  confirmRemove: propConfirmRemove,
  setConfirmRemove: propSetConfirmRemove,
  prepareFunctionsForRemoval: propPrepareFunctionsForRemoval,
  affectedFunctions: propAffectedFunctions,
  selectiveFunctions: propSelectiveFunctions,
  isSelectiveRemoval: propIsSelectiveRemoval,
  setIsSelectiveRemoval: propSetIsSelectiveRemoval,
  handleRemoveAll: propHandleRemoveAll,
  handleSelectiveRemove: propHandleSelectiveRemove,
  toggleFunction: propToggleFunction,
  toggleAll: propToggleAll
}: BaseMaterialCardProps<T>) {
  
  // Use Material Actions hook if props aren't provided
  const hooksResult = useMaterialActions<T>({
    material,
    garden,
    findAffectedFunctions,
    onUpdate,
    materialType
  });
  
  // Use provided props if available, otherwise use the hook results
  const confirmRemove = propConfirmRemove !== undefined ? propConfirmRemove : hooksResult.confirmRemove;
  const setConfirmRemove = propSetConfirmRemove || hooksResult.setConfirmRemove;
  const editSelectiveFunctions = propEditSelectiveFunctions || hooksResult.editSelectiveFunctions;
  const editAffectedFunctions = propEditAffectedFunctions || hooksResult.editAffectedFunctions;
  const isSelectiveEditing = propIsSelectiveEditing !== undefined ? propIsSelectiveEditing : hooksResult.isSelectiveEditing;
  const setIsSelectiveEditing = propSetIsSelectiveEditing || hooksResult.setIsSelectiveEditing;
  const selectiveFunctions = propSelectiveFunctions || hooksResult.selectiveFunctions;
  const affectedFunctions = propAffectedFunctions || hooksResult.affectedFunctions;
  const isSelectiveRemoval = propIsSelectiveRemoval !== undefined ? propIsSelectiveRemoval : hooksResult.isSelectiveRemoval;
  const setIsSelectiveRemoval = propSetIsSelectiveRemoval || hooksResult.setIsSelectiveRemoval;
  const materialLink = material?.url || (material?.doi ? `https://doi.org/${material.doi}` : undefined);
  const prepareFunctionsForRemoval = propPrepareFunctionsForRemoval || hooksResult.prepareFunctionsForRemoval;
  const applyEditToAllFunctions = propApplyEditToAllFunctions || hooksResult.applyEditToAllFunctions;
  const applySelectiveEdit = propApplySelectiveEdit || hooksResult.applySelectiveEdit;
  const toggleEditFunction = propToggleEditFunction || hooksResult.toggleEditFunction;
  const toggleEditAll = propToggleEditAll || hooksResult.toggleEditAll;
  const handleRemoveAll = propHandleRemoveAll || hooksResult.handleRemoveAll;
  const handleSelectiveRemove = propHandleSelectiveRemove || hooksResult.handleSelectiveRemove;
  const toggleFunction = propToggleFunction || hooksResult.toggleFunction;
  const toggleAll = propToggleAll || hooksResult.toggleAll;

  const handleUpdate = async () => {
    if (onUpdate) {
      await onUpdate();
    }
  };

  return (
    <>
      <Card className="rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md overflow-hidden group backdrop-blur-sm bg-white">
        <CardHeader className="pt-5 pb-2 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="text-green bg-green/10 p-2 rounded-lg flex-shrink-0">
              {icon}
            </div>
            <CardTitle className="font-medium text-lg text-gray-800 tracking-tight">
              {materialLink ? (
                <a 
                  href={materialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline transition-colors"
                >
                  {title}
                </a>
              ) : (
                <span>{title}</span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-2 text-sm">
          <div className="text-gray-700">
            {children}
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex items-center">
          {isOwner && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 hover:text-green hover:bg-green/10 transition-colors h-7 px-2 rounded-md"
                onClick={async () => {
                  if (onEditClick) await onEditClick();
                }}
                aria-label={`Edit ${materialType}`}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors h-7 px-2 rounded-md"
                onClick={async () => {
                  if (prepareFunctionsForRemoval) await prepareFunctionsForRemoval();
                }}
                aria-label={`Remove ${materialType}`}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Only render these dialogs if we're not rendering them in the parent component */}
      {!propIsSelectiveEditing && (
        <EditDialog
          isOpen={isSelectiveEditing}
          onClose={() => setIsSelectiveEditing(false)}
          materialType={materialType}
          editAffectedFunctions={editAffectedFunctions}
          editSelectiveFunctions={editSelectiveFunctions}
          toggleEditFunction={toggleEditFunction}
          toggleEditAll={toggleEditAll}
          applyEditToAllFunctions={applyEditToAllFunctions}
          applySelectiveEdit={applySelectiveEdit}
        />
      )}
      
      {!propConfirmRemove && (
        <RemoveDialog
          isOpen={confirmRemove}
          onClose={() => setConfirmRemove(false)}
          materialType={materialType}
          affectedFunctions={affectedFunctions}
          selectiveFunctions={selectiveFunctions}
          toggleFunction={toggleFunction}
          toggleAll={toggleAll}
          handleRemoveAll={handleRemoveAll}
          handleSelectiveRemove={handleSelectiveRemove}
          isSelectiveRemoval={isSelectiveRemoval}
          setIsSelectiveRemoval={setIsSelectiveRemoval}
        />
      )}
    </>
  );
} 