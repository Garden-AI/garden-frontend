import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { TagIcon } from "lucide-react";
import { Garden } from "@/api/types";
import { useState } from "react";
import { useGetUserInfo } from "@/api";
import { useGetUserGardens } from "../api/getUserGardens";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";

const GardenBox = ({ garden }: { garden: Garden }) => {
  const navigate = useNavigate();
  // const [isSaved, setIsSaved] = useState(false);
  const auth = useGlobusAuth();

  const { data: currUserInfo } = useGetUserInfo();
  const { data: userGardens } = useGetUserGardens(currUserInfo?.identity_id);

  const canEditGarden =
    !!garden && !!userGardens && userGardens.some((userGarden) => userGarden.doi === garden.doi);

  const { title, description, doi, tags } = garden;

  const handleClick = () => {
    navigate(`/garden/${encodeURIComponent(doi)}`);
  };

  // const handleSaveClick = (e: any) => {
  //   e.stopPropagation();
  //   setIsSaved(!isSaved);
  //   // implement logic here
  //   // use api hook (not yet created)
  //   console.log(isSaved);
  // };

  const handleEditGardenClick = (e: any) => {
    e.stopPropagation();
    navigate(`/garden/${encodeURIComponent(doi)}/edit`);
  };

  return (
    <Card
      className="h-full min-h-[250px] w-full cursor-pointer border-gray-200 shadow-sm transition hover:border-gray-300 hover:shadow-md"
      onClick={handleClick}
    >
      <div className="flex h-full flex-col">
        <CardHeader className="">
          <CardTitle className="text-ellipsis text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <div className="relative h-[125px] overflow-hidden">
            <p className="opacity-60">{description}</p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </CardContent>
        <CardFooter className="relative mt-auto flex flex-wrap gap-1">
          {tags && tags.length > 0 && (
            <div>
              <TagIcon className="mr-2 inline h-5 w-5 text-gray-500" />
              {tags.map((value: any, index: number) => (
                <span
                  key={index}
                  className="mx-0.5 rounded-lg bg-primary p-1 px-2 text-xs text-primary-foreground"
                >
                  {value}
                </span>
              ))}
            </div>
          )}
          <div className="ml-auto flex items-center">
            {canEditGarden && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pencil mr-2 cursor-pointer stroke-black"
                onClick={handleEditGardenClick}
              >
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
            )}

            {/* {auth.isAuthenticated && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-bookmark ml-4 cursor-pointer ${
                  isSaved ? "fill-green stroke-green" : "stroke-black"
                }`}
                onClick={handleSaveClick}
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            )} */}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default GardenBox;
