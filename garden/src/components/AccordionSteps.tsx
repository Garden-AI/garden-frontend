import {
  AccordionItem
} from "@szhsin/react-accordion";

const AccordionSteps = (props: { step: any; index: any }) => {
  return (
    <div>
    {props.index>0 ? <div className="flex justify-center">
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
          d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
        />
      </svg>
      </div> : <></>}
      <AccordionItem
        className="border border-gray-300 my-8"
        header={({ state: { isEnter } }) => (
          <div className="inline-flex w-full justify-between p-4">
            <span className="text-2xl">
              <span className="text-xl text-gray-400 pr-12">
                {props.index + 1}{" "}
              </span>
              {props.step.title}
            </span>
            <img
              className={`ml-auto transition-transform duration-200 ease-out ${
                isEnter && "rotate-180"
              }`}
              src="../img/chevron.svg"
              alt="Chevron"
            />
          </div> 
        )}
        buttonProps={{
          className: ({ isEnter }) =>
            `w-full hover:bg-gray-100 ${isEnter && "bg-gray-100"}`,
        }}
      >
        <p className="p-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum{" "}
        </p>
      </AccordionItem>
      {/* <div className="flex justify-center">
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
          d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
        />
      </svg>
      </div> */}
    </div>
  );
};

export default AccordionSteps;
