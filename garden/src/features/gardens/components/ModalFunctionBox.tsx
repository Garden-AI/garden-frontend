import React from "react";
import { ModalFunction } from "@/types";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardFooter, MarkdownCardContent } from "@/components/shadcn/card";
import { FunctionSquare, Cpu } from "lucide-react";

interface ModalFunctionBoxProps {
  modalFunction: ModalFunction;
  gardenDoi?: string;
}

const ModalFunctionBox = ({ modalFunction, gardenDoi }: ModalFunctionBoxProps) => {
  const navigate = useNavigate();
  const id = modalFunction.id;

  if (!modalFunction) {
    return null;
  }

  return (
    <Card
      className="rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md overflow-hidden group backdrop-blur-sm bg-white cursor-pointer"
      onClick={() => navigate(gardenDoi ? `/garden/${encodeURIComponent(gardenDoi)}/modal-functions/${id}` : `/modal-functions/${id}`)}
    >
      <CardHeader className="pt-5 pb-2 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="text-green bg-green/10 p-2 rounded-lg flex-shrink-0">
            <FunctionSquare className="h-4 w-4" />
          </div>
          <CardTitle className="font-medium text-lg text-gray-800 tracking-tight">
            {modalFunction.title || "Untitled"}
          </CardTitle>
        </div>
      </CardHeader>

      <MarkdownCardContent
        className="text-sm text-gray-700 max-h-[120px] overflow-hidden"
        content={modalFunction.description || "No description available"}
      />

      {(modalFunction.tags && modalFunction.tags.length > 0 || modalFunction.hardware_spec?.gpus) && (
        <CardFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex flex-row items-center">
          {/* Tags Section */}
          {modalFunction.tags && modalFunction.tags.length > 0 && (
            <div className="flex gap-2 text-gray-600 text-xs items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <span>{modalFunction.tags.slice(0, 4).join(", ")}</span>
            </div>
          )}
          {/* Hardware Spec Section */}
          {modalFunction.hardware_spec?.gpus && (
            <div className="flex gap-2 text-gray-600 text-xs items-center ml-auto">
              <Cpu className="h-4 w-4 flex-shrink-0" />
              <span>GPU: {modalFunction.hardware_spec.gpus}</span>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export default ModalFunctionBox;
