import LoadingSpinner from "./LoadingSpinner";

export const LoadingOverlay = () => {
  return (
    <div role="status" aria-label="loading" className="no-doc-scroll fixed bottom-10 left-0 right-0 top-10 z-50 flex items-center justify-center ">
      <LoadingSpinner />
    </div>
  );
};
