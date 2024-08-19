import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileInfo from "@/components/UserProfilePageComponents/UserProfileInfo";
import MyGardens from "@/components/UserProfilePageComponents/MyGardens";
import SavedGardens from "@/components/UserProfilePageComponents/SavedGardens";

const UserProfileTabs = () => {
  return (
    <Tabs defaultValue="profile" className="w-full font-display">
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
      </div>
    </Tabs>
  );
};

export default UserProfileTabs;
