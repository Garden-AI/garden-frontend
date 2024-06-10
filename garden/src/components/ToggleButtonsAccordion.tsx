const ToggleButtonsAccordion = ({ toggleAll }: { toggleAll: Function }) => {
  return (
    <div className="flex justify-end gap-4 pb-2">
      <button
        className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 hover:shadow-md"
        onClick={() => toggleAll(true)}
      >
        <div className="flex h-6 flex-col gap-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <p>Expand All</p>
      </button>
      <button
        className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 hover:shadow-md"
        onClick={() => toggleAll(false)}
      >
        <div className="flex h-6 flex-col gap-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </div>
        <p>Collapse All</p>
      </button>
    </div>
  );
};

export default ToggleButtonsAccordion;
