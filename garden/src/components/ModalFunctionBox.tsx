import { ModalFunction } from "@/api/types";
import { useNavigate, Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetEntrypoints } from "@/api";
import { useGlobusAuth } from "./auth/useGlobusAuth";

const ModalFunctionBox = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  const navigate = useNavigate();
  const id = modalFunction.id;

  if (!modalFunction) {
    return null;
  }

  return (
    <div
      className="flex flex-col justify-between rounded-lg border border-gray-200 p-5 shadow-sm hover:cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/modal/${id}`)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl">{modalFunction.title || "Untitled"}</h2>
        </div>
        <div className="max-h-[120px] overflow-y-hidden">
          <p className="h-[160px] overflow-y-hidden bg-gradient-to-b from-black to-white bg-clip-text text-transparent">
            {modalFunction.description || "No description available"}
          </p>
        </div>
      </div>
      {modalFunction.tags && modalFunction.tags.length > 0 ? (
        <div className="flex gap-2 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <div>
            <span>{modalFunction.tags?.join(", ")}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ModalFunctionBox;
