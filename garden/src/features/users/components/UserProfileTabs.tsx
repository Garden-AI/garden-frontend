import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import UserProfileInfo from "./UserProfileInfo";
import MyGardens from "./MyGardens";
import SavedGardens from "./SavedGardens";
import { ModelDeployments } from "@/features/model-deployments/ModelDeployments";

const TABS = ["profile", "my-gardens", "saved-gardens", "model-deployments"] as const;
type TabKey = (typeof TABS)[number];

type UserProfileTabsProps = {
  defaultTab?: TabKey;
};

const UserProfileTabs = ({ defaultTab }: UserProfileTabsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const queryTab = params.get("tab");

  const resolveTab = (): TabKey => {
    if (queryTab && TABS.includes(queryTab as TabKey)) return queryTab as TabKey;
    if (defaultTab && TABS.includes(defaultTab)) return defaultTab;
    return "profile";
  };

  const [currentTab, setCurrentTab] = React.useState<TabKey>(resolveTab)

  React.useEffect(() => {
    const urlTab = params.get("tab");
    if (urlTab && TABS.includes(urlTab as TabKey) && urlTab !== currentTab) {
      setCurrentTab(urlTab as TabKey);
    }
  }, [location.search]);

  const handleTabChange = (newTab: string) => {
    const newTabKey = newTab as TabKey;
    setCurrentTab(newTabKey);
    params.set("tab", newTabKey);
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full font-display">
      <TabsList className="h-12 w-full bg-transparent">
        <TabsTrigger
          value="profile"
          className="h-full w-full border-b-4  bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green data-[state=active]:border-green data-[state=active]:bg-green data-[state=active]:bg-opacity-30"
        >
          Profile Information
        </TabsTrigger>
        <TabsTrigger
          value="my-gardens"
          className="h-full w-full border-b-4 bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green data-[state=active]:border-green data-[state=active]:bg-green data-[state=active]:bg-opacity-30"
        >
          My Gardens
        </TabsTrigger>
        <TabsTrigger
          value="saved-gardens"
          className="h-full w-full border-b-4 bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green data-[state=active]:border-green data-[state=active]:bg-green data-[state=active]:bg-opacity-30"
        >
          Saved Gardens
        </TabsTrigger>
        <TabsTrigger
          value="model-deployments"
          className="h-full w-full border-b-4 bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green data-[state=active]:border-green data-[state=active]:bg-green data-[state=active]:bg-opacity-30"
        >
          Model Deployments
        </TabsTrigger>
      </TabsList>

      <div className="min-h-[60vh] flex-grow overflow-auto pt-4 sm:pt-8">
        <TabsContent value="profile">
          <div className="flex w-full justify-center">
            <UserProfileInfo />
          </div>
        </TabsContent>
        <TabsContent value="my-gardens">
          <div className="px-6">
            <MyGardens />
          </div>
        </TabsContent>
        <TabsContent value="saved-gardens">
          <div className="px-6">
            <SavedGardens />
          </div>
        </TabsContent>
        <TabsContent value="model-deployments">
          <div className="px-6">
            <ModelDeployments />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default UserProfileTabs;
