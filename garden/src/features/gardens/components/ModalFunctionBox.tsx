import React from "react";
import { ModalFunction } from "@/types";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardFooter, MarkdownCardContent } from "@/components/shadcn/card";
import { FunctionSquare, Cpu, Tag, Repeat } from "lucide-react";

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
      className="rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md overflow-hidden group backdrop-blur-sm bg-white cursor-pointer flex flex-col h-full"
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
        className="text-sm text-gray-700 max-h-[120px] overflow-hidden gap-3 flex-grow"
        content={modalFunction.description || "No description available"}
      />

      {(modalFunction.tags && modalFunction.tags.length > 0 || modalFunction.hardware_spec?.gpus || (modalFunction.num_invocations || 0) > 0) && (
        <CardFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex flex-row items-center text-xs text-gray-600">
          <div className="flex justify-between items-center w-full gap-3">
            {/* Left Section: Tags */}
            <div className="flex items-center gap-1 overflow-hidden">
              {modalFunction.tags && modalFunction.tags.length > 0 && (
                <>
                  <Tag className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {modalFunction.tags.slice(0, 2).join(", ")}
                    {modalFunction.tags.length > 2 ? "..." : ""}
                  </span>
                </>
              )}
            </div>

            {/* Right Section: GPU and Invocations */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Hardware Spec Section */}
              {modalFunction.hardware_spec?.gpus && (
                <div className="flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  <span>{modalFunction.hardware_spec.gpus} GPU</span>
                </div>
              )}
              {/* Invocations */}
              {(modalFunction.num_invocations || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Repeat className="h-3 w-3" />
                  <span>{modalFunction.num_invocations} runs</span>
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default ModalFunctionBox;
