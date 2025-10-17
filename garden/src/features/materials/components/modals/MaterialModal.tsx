import { Garden, ModalFunction, HpcFunctionMetadataResponse } from "@/types";

export interface MaterialModalProps {
    context:  MaterialModalContext,
}

export interface MaterialModalContext {
    garden?: Garden,
    modalFunction?: ModalFunction,
    hpcFunction?: HpcFunctionMetadataResponse,
}