import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { useNavigate } from "react-router-dom";
import { TagIcon } from "lucide-react";
import { Garden } from "@/api/types";
import { useState } from "react";

const GardenBox = ({ garden }: { garden: Garden }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const { title, description, doi, tags } = garden;

  const handleClick = () => {
    navigate(`/garden/${encodeURIComponent(doi)}`);
  };

  const handleSaveClick = (e: any) => {
    // hook to write data to backend (need to save doi of saved garden in 'saved gardens' field of user table)
    e.stopPropagation();
    setIsSaved(!isSaved);
    console.log(isSaved);
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
        <CardFooter className="mt-auto flex flex-wrap gap-1 relative">
          {tags && tags.length > 0 && (
            <div>
              <TagIcon className="mr-2 inline h-5 w-5 text-gray-500" />
              {tags.map((value: any, index: number) => (
                <span
                  key={index}
                  className="mx-0.5 rounded-lg bg-primary p-1 px-2  text-xs text-primary-foreground"
                >
                  {value}
                </span>
              ))}
            </div>
          )}
          {/**only render if logged in, add that logic later*/}
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
            className={`lucide lucide-bookmark absolute bottom-6 right-6 cursor-pointer ${
              (isSaved) ? 'stroke-green fill-green' : 'stroke-black'
            }`}
            onClick={handleSaveClick}
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </CardFooter>
      </div>
    </Card>
  );
};

export default GardenBox;
