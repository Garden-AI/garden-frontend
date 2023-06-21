import {
  ControlledAccordion,
  AccordionItem,
  useAccordionProvider,
} from "@szhsin/react-accordion";

const AccordionTop = () => {
  const providerValue = useAccordionProvider({
    allowMultiple: true,
  });
  const { toggleAll } = providerValue;

  return (
    <div>
      <div className="flex justify-end pb-2">
        <button
          className="btn px-3 hover:underline"
          onClick={() => toggleAll(true)}
        >
          Open all items
        </button>
        <button
          className="btn px-3 hover:underline"
          onClick={() => toggleAll(false)}
        >
          Close all items
        </button>
      </div>
      <ControlledAccordion
        providerValue={providerValue}
        className=" font-display flex flex-col w-full mr-32"
      >
        <AccordionItem
          className="border-y border-gray-300"
          header={({ state: { isEnter } }) => (
            <div className="inline-flex w-full justify-between p-4">
              <span className="">&#128064; At a glance</span>
              {isEnter ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
          initialEntered
        >
          <p className="p-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum{" "}
          </p>
        </AccordionItem>

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
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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

        <AccordionItem
          className="border-y border-gray-300"
          header={({ state: { isEnter } }) => (
            <div className="inline-flex w-full justify-between p-4">
              <span className="">&#128206; Associated Materials</span>
              {isEnter ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
          <p className="p-4">Materials</p>
        </AccordionItem>

        <AccordionItem
          className="border-y border-gray-300"
          header={({ state: { isEnter } }) => (
            <div className="inline-flex w-full justify-between p-4">
              <span className="">&#128167; Pipeline FAIR-ness</span>
              {isEnter ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
          <p className="p-4">FAIR</p>
        </AccordionItem>

        <AccordionItem
          className="border-y border-gray-300"
          header={({ state: { isEnter } }) => (
            <div className="inline-flex w-full justify-between p-4">
              <span className="">&#128678; Testing</span>
              {isEnter ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
          <p className="p-4">Testing</p>
        </AccordionItem>
      </ControlledAccordion>
    </div>
  );
};

export default AccordionTop;
