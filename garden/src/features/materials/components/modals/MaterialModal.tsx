import { Garden, ModalFunction } from "@/types";

export interface MaterialModalProps {
    context:  MaterialModalContext,
}

export interface MaterialModalContext {
    garden?: Garden,
    modalFunction?: ModalFunction,
}