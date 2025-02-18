import { ModalFunction } from "@/types";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardFooter, MarkdownCardContent } from "@/components/ui/card";

const ModalFunctionBox = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  const navigate = useNavigate();
  const id = modalFunction.id;

  if (!modalFunction) {
    return null;
  }

  return (
    <Card
      className="cursor-pointer shadow-sm hover:shadow-md"
      onClick={() => navigate(`/modal-functions/${id}`)}
    >
      <CardHeader>
        <CardTitle className="text-xl">{modalFunction.title || "Untitled"}</CardTitle>
      </CardHeader>
      <MarkdownCardContent 
        className="max-h-[120px] overflow-hidden"
        content={modalFunction.description || "No description available"}
      />
      {modalFunction.tags && modalFunction.tags.length > 0 && (
        <CardFooter className="flex gap-2 text-black">
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
        </CardFooter>
      )}
    </Card>
  );
}

export default ModalFunctionBox;
