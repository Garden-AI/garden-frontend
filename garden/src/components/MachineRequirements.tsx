import { AccordionItem } from "@szhsin/react-accordion";

const MachineRequirements = () => {
  return (
    <AccordionItem
      className="border-y border-gray-300"
      header={({ state: { isEnter } }) => (
        <div className="inline-flex w-full justify-between p-4">
          <span className="">&#128187; Machine Requirements</span>
          {isEnter ? (
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
                d="M19.5 12h-15"
              />
            </svg>
          ) : (
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </div>
      )}
      buttonProps={{
        className: ({ isEnter }) =>
          `w-full hover:bg-gray-100 ${isEnter && "bg-gray-100"}`,
      }}
    >
      <p className="p-4">Machine</p>
    </AccordionItem>
  );
};

export default MachineRequirements;
