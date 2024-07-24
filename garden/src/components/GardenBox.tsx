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

const GardenBox = ({ garden }: { garden: Garden }) => {
  const navigate = useNavigate();

  const { title, description, doi, tags } = garden;

  const handleClick = () => {
    navigate(`/garden/${encodeURIComponent(doi)}`);
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
        <CardFooter className="mt-auto flex flex-wrap gap-1">
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
        </CardFooter>
      </div>
    </Card>
  );
};

export default GardenBox;
