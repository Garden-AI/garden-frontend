import React from "react";
import { useNavigate } from "react-router-dom";
import { Garden } from "../types";
import TagsIcon from "./icons/TagsIcon";

const GardenBox = ({ garden }: { garden: Garden }) => {
  const navigate = useNavigate();
  const text = garden.doi?.replace("/", "%2f");

  return (
    <div
      className="text-display flex min-w-[50%] flex-col justify-between rounded-lg border border-gray-200 p-5 shadow-sm hover:cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/garden/${text}`)}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-l font-semibold">{garden.title}</h2>
        <div className="max-h-[120px] overflow-y-hidden">
          <p className="h-[160px] overflow-y-hidden bg-gradient-to-b from-black bg-clip-text text-transparent">
            {garden.description}
          </p>
        </div>
      </div>
      {garden.tags && (
        <div className="flex gap-4 text-sm text-gray-500">
          <TagsIcon />
          <div>
            <span>{garden.tags.join(", ")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenBox;
