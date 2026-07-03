import React from "react";
import { Card, CardHeader, CardTitle, CardFooter, MarkdownCardContent } from "../../../components/shadcn/card";
import { useNavigate } from "react-router-dom";
import { TagIcon } from "lucide-react";
import { Garden } from "@/types";
import { useGetUserInfo } from "@/features/users/api/useGetUserInfo";
import { useGetGardens } from "@/features/gardens/api/useGetGardens";

const GardenBox = ({ garden, allowEdits }: { garden: Garden, allowEdits: boolean }) => {
  const navigate = useNavigate();

  const { data: currUserInfo } = useGetUserInfo();

  let userGardens;
  if (allowEdits) {
    const { data: gardens } = useGetGardens({ owner_uuid: currUserInfo?.identity_id });
    userGardens = gardens;
  }

  const canEditGarden =
    !!garden && !!userGardens && userGardens.some((userGarden: Garden) => userGarden.doi === garden.doi);

  const { title, description, doi, tags } = garden;

  const handleClick = () => {
    navigate(`/garden/${encodeURIComponent(doi)}`);
  };

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
        <MarkdownCardContent
          className="flex-grow overflow-hidden [mask-image:linear-gradient(to_bottom,black_62%,transparent_98%)]"
          content={description || ""}
        />
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
            {canEditGarden && allowEdits && (
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
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default GardenBox;
