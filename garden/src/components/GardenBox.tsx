import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const GardenBox = ({ garden }: { garden: any }) => {
  const navigate = useNavigate();
  return (
    <Card
      className="h-full min-h-[250px] w-full cursor-pointer border-gray-200 shadow-sm transition hover:border-gray-300 hover:shadow-md"
      onClick={() =>
        navigate(`/garden/${garden.entries[0].content.doi.replace("/", "%2f")}`)
      }
    >
      <CardHeader>
        <CardTitle className="text-ellipsis text-lg">
          {garden.entries[0].content.title}
        </CardTitle>
      </CardHeader>
      <CardContent className=" overflow-hidden">
        <div className="overflow-hidden">
          <p className="font-thin opacity-70 ">
            {garden.entries[0].content.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="">
        {/* <TagIcon /> */}
        {garden.entries[0].content.tags && (
          <div className="flex gap-4 text-sm text-gray-500">
            <div>{garden.entries[0].content.tags.join(", ")}</div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default GardenBox;
