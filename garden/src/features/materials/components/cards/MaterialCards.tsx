import { ModalFunction } from "@/types";

// Re-export card components from their individual files
export { DatasetCard } from "./DatasetCard";
export { PaperCard } from "./PaperCard";
export { RepositoryCard } from "./RepositoryCard";
export { NotebookCard } from "./NotebookCard";

export interface MaterialContext {
  parentFunction: ModalFunction;
  parentDoi?: string;
}

export interface MaterialCardProps {
  isOwner: boolean;
  context: MaterialContext;
} 