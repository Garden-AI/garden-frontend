import {
  ControlledAccordion,
  AccordionItem,
  useAccordionProvider,
} from "@szhsin/react-accordion";
// import ContainerImage from "./ContainerImage";
// import MachineRequirements from "./MachineRequirements";
// import FairScore from "./FairScore";
// import TestingTab from "./TestingTab";
// import ToggleButtonsAccordion from "./ToggleButtonsAccordion";

// https://szhsin.github.io/react-accordion/ for the accordion tabs

const AccordionTop = ({ pipeline }: { pipeline: any }) => {
  const providerValue = useAccordionProvider({
    allowMultiple: true,
  });
  // toggleAll is passed into ToggleButtonsAccordion component, uncomment when more accordion tabs are added
  // const { toggleAll } = providerValue;

  const copy = async (text: any) => {
    await navigator.clipboard.writeText(text);
  };
  let associatedCount = 0;

  return (
    <div>
      {/* <ToggleButtonsAccordion toggleAll={toggleAll}/> */}
      <ControlledAccordion
        providerValue={providerValue}
        className=" font-display flex flex-col w-full mr-32"
      >
        {/* <MachineRequirements/> */}

        <AccordionItem
          className="border-y border-gray-300"
          initialEntered
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
          <div className="grid grid-cols-1 md:grid-cols-2 py-4 gap-x-12 lg:gap-x-32 gap-y-12 px-8 lg:px-16">
            {pipeline[0].papers ? (
              <>
                {associatedCount++}
                {pipeline[0].papers.map((paper: any) => {
                  return (
                    <div className="flex flex-col justify-between border border-gray-300 border-1 rounded-xl">
                      <div className="flex items-center px-2 pt-2 pb-6 gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="gray"
                          className="w-12 h-12"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                          />
                        </svg>

                        <h1 className="text-2xl">{paper.title}</h1>
                      </div>
                      <div className="px-2 py-2">
                        
                        {paper.authors ? paper.authors.length > 0 ? <p>
                          Authors:
                          {paper.authors
                            .map((author: any) => <span> {author}</span>)
                            .reduce((prev: any, curr: any) => [
                              prev,
                              ", ",
                              curr,
                            ])}
                        </p> : <></> : <></>}
                        {paper.doi ? (
                          <p className="py-2 flex gap-2">
                            DOI: {paper.doi}{" "}
                            <button
                              title="Copy DOI"
                              onClick={() => copy(paper.doi)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="gray"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                                />
                              </svg>
                            </button>
                          </p>
                        ) : (
                          <></>
                        )}
                        {paper.citation ? (
                          <button
                            className="flex gap-2"
                            title="Copy Citation"
                            onClick={() => copy(paper.citation)}
                          >
                            Copy Citation
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="gray"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                              />
                            </svg>
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <></>
            )}
            {/* repo box */}
            {pipeline[0].repositories ? (
              <>
                {associatedCount++}
                {pipeline[0].repositories.map((repo: any) => {
                  return (
                    <div className="flex flex-col justify-between border border-gray-300 border-1 rounded-xl">
                      <div className="flex items-center px-2 pt-2 pb-6 gap-4">
                        <img
                          src="img/github-logo.png"
                          className="max-w-[5vw]"
                          alt="Github logo"
                        />

                        <h1 className="text-2xl">{repo.repo_name}</h1>
                      </div>
                      <div className="px-2 py-2">
                        {repo.contributors ? repo.contributors.length > 0 ? (
                          <p className="pb-2">
                            Contributors:
                            {repo.contributors
                              .map((author: any) => <span> {author}</span>)
                              .reduce((prev: any, curr: any) => [
                                prev,
                                ", ",
                                curr,
                              ])}
                          </p>
                        ) : (
                          <></>
                        ): <></>}
                        <div className="flex justify-between items-center">
                          <button
                            className="flex gap-2"
                            title="Copy Link"
                            onClick={() => copy(repo.url)}
                          >
                            Copy Link
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="gray"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                              />
                            </svg>
                          </button>

                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black border px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-300"
                          >
                            Visit Repo
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <></>
            )}

            {/* Container Image */}
            {/* <ContainerImage container={fakeContainer}/> */}
            {associatedCount === 0 ? (
              <p>No associated materials available</p>
            ) : (
              <></>
            )}
          </div>
        </AccordionItem>

        {/* <FairScore/> */}

        {/* <TestingTab/> */}
      </ControlledAccordion>
    </div>
  );
};

export default AccordionTop;
