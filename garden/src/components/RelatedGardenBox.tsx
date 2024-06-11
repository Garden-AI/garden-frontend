import { useNavigate } from "react-router-dom";
import { Garden } from "../types";
// import RelatedGardenMetrics from "./RelatedGardenMetrics";

const RelatedGardenBox = ({ garden }: { garden: Garden }) => {
  const navigate = useNavigate();
  const text = garden.doi.replace("/", "%2f");

  return (
    <div
      className="text-display flex h-56 min-w-[275px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100 px-5 shadow-sm hover:cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/garden/${text}`)}
    >
      <div className="my-10 overflow-y-hidden whitespace-normal">
        <p className="text-center text-3xl">{garden.title}</p>
      </div>

      {/* Pins Shares and Runs For Related Garden Box */}
      {/* <RelatedGardenMetrics/> */}
    </div>
  );
};

export default RelatedGardenBox;
