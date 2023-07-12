import {
  ControlledAccordion,
  AccordionItem,
  useAccordionProvider,
} from "@szhsin/react-accordion";

// https://szhsin.github.io/react-accordion/ for the accordion tabs

const AccordionTop = () => {
  const providerValue = useAccordionProvider({
    allowMultiple: true,
  });
  const { toggleAll } = providerValue;

  const fakePapers = [
    {
      title: "Paper Title 1",
      authors: [
        "First Last",
        "First Last",
        "First Last",
        "First Last",
        "First Last",
        "First Last",
      ],
      doi: "10.3792.1237",
      citation:
        "Fang Ren et al. ,Accelerated discovery of metallic glasses through iteration of machine learning and high-throughput experiments.Sci. Adv.4,eaaq1566(2018).DOI:10.1126/sciadv.aaq1566",
    },
    {
      title: "Paper Title 2",
      authors: [
        "First Last",
        "First Last",
        "First Last",
        "First Last",
        "First Last",
        "First Last",
      ],
      doi: "10.3792.1238",
      citation:
        "Fang Ren et al. ,Accelerated discovery of metallic glasses through iteration of machine learning and high-throughput experiments.Sci. Adv.4,eaaq1566(2018).DOI:10.1126/sciadv.aaq1566",
    },
  ];
  const fakeRepo = {
    title: "Repository Name",
    contributors: [
      "First Last",
      "First Last",
      "First Last",
      "First Last",
      "First Last",
      "First Last",
    ],
    url: "https://github.com/",
  };
  const fakeContainer = {
    title: "Container Image Name",
    id: "sidngrj329fm32",
    fileSize: "3.12 GB",
    status: "Running",
    created: "3 Days ago",
    url: "https://google.com",
  };
  // const fakeSoftwareTesting = [
  //   {
  //     test: "Python 3.9 - GPU",
  //     status: "p",
  //     date: "3 days ago",
  //   },
  //   {
  //     test: "Python 3.9 - CPU",
  //     status: "p",
  //     date: "3 days ago",
  //   },
  //   {
  //     test: "Python 3.8 - GPU",
  //     status: "f",
  //     date: "3 days ago",
  //   },
  // ];
  // const fakeReliabilityTesting = [
  //   {
  //     test: "LIGO Validation Set 1",
  //     status: "p",
  //     date: "5 minutes ago",
  //     accuracy: "0.95",
  //   },
  //   {
  //     test: "LIGO Training Set",
  //     status: "p",
  //     date: "1 day ago",
  //     accuracy: "1.0",
  //   },
  //   {
  //     test: "LIGO Validation Set 2",
  //     status: "f",
  //     date: "2 days ago",
  //     accuracy: "0.85",
  //   },
  // ];
  // const fakePerformanceTesting = [
  //   {
  //     title: "CPU",
  //     iterations: 20,
  //   },
  //   {
  //     title: "GPU",
  //     iterations: 100,
  //   },
  //   {
  //     title: "Hardware Accelerator",
  //     iterations: 500,
  //   },
  // ];

  const copy = async (text: any) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex justify-end pb-2 gap-4">
        <button
          className="px-3 flex items-center border border-gray-300 rounded py-2 gap-2 hover:shadow-md"
          onClick={() => toggleAll(true)}
        >
          <div className="flex flex-col gap-0 h-6">
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
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>

          <p>Expand All</p>
        </button>
        <button
          className="px-3 flex items-center border border-gray-300 rounded py-2 gap-2 hover:shadow-md"
          onClick={() => toggleAll(false)}
        >
          <div className="flex flex-col gap-0 h-6">
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
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
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          </div>
          <p>Collapse All</p>
        </button>
      </div>
      <ControlledAccordion
        providerValue={providerValue}
        className=" font-display flex flex-col w-full mr-32"
      >
        {/* To do: Machine Requirements and what that entails */}

        {/* <AccordionItem
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
        </AccordionItem> */}

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
          <div className="grid grid-cols-1 md:grid-cols-2 py-4 gap-x-12 lg:gap-x-32 gap-y-12 px-8 lg:px-16">
            {fakePapers.map((paper) => {
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
                    <p>
                      Authors:
                      {paper.authors
                        .map<React.ReactNode>((author) => (
                          <span> {author}</span>
                        ))
                        .reduce((prev, curr) => [prev, ", ", curr])}
                    </p>
                    <p className="py-2 flex gap-2">
                      DOI: {paper.doi}{" "}
                      <button title="Copy DOI" onClick={() => copy(paper.doi)}>
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
                  </div>
                </div>
              );
            })}
            {/* repo box */}
            <div className="flex flex-col justify-between border border-gray-300 border-1 rounded-xl">
              <div className="flex items-center px-2 pt-2 pb-6 gap-4">
                <img
                  src="img/github-logo.png"
                  className="max-w-[5vw]"
                  alt="Github logo"
                />

                <h1 className="text-2xl">{fakeRepo.title}</h1>
              </div>
              <div className="px-2 py-2">
                <p className="pb-2">
                  Contributors:
                  {fakeRepo.contributors
                    .map<React.ReactNode>((author) => <span> {author}</span>)
                    .reduce((prev, curr) => [prev, ", ", curr])}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    className="flex gap-2"
                    title="Copy Link"
                    onClick={() => copy(fakeRepo.url)}
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
                    href={fakeRepo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black border px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-300"
                  >
                    Visit Repo
                  </a>
                </div>
              </div>
            </div>

            {/* Container Image */}
            <div className="flex flex-col justify-between border border-gray-300 border-1 rounded-xl">
              <div className="flex items-center px-2 pt-2 pb-4 gap-4">
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
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>

                <h1 className="text-2xl">{fakeContainer.title}</h1>
              </div>
              <div className="px-2 py-2">
                <div className="grid grid-cols-2">
                  <p className="pb-4">ID: {fakeContainer.id}</p>
                  <p>Filesize: {fakeContainer.fileSize}</p>
                  <p className="pb-4">Status: {fakeContainer.status}</p>
                  <p>Created: {fakeContainer.created}</p>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    className="flex gap-2"
                    title="Copy Link"
                    onClick={() => copy(fakeContainer.url)}
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
                    href={fakeRepo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black border px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-300"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* <AccordionItem
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
        </AccordionItem> */}

        {/* <AccordionItem
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
          <div className="grid grid-cols-1 md:grid-cols-2 py-4 gap-x-12 lg:gap-x-32 gap-y-12 px-8 lg:px-16">
            <div className="flex flex-col border border-gray-300 gap-2 border-1 rounded-xl pb-2">
              <h1 className="text-2xl p-4 underline">Software Testing</h1>
              {fakeSoftwareTesting.map((test) => {
                return (
                  <div className="flex items-center gap-4 px-4 py-1">
                    {test.status === "p" ? (
                      <span className="min-w-[25px] h-[25px] bg-green rounded-xl"></span>
                    ) : (
                      <span className="min-w-[25px] h-[25px] bg-fail rounded-xl"></span>
                    )}
                    <p>{test.test}</p>
                    <span className="text-gray-500">{test.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col border border-gray-300 gap-2 border-1 rounded-xl pb-2">
              <h1 className="text-2xl p-4 underline">Reliability Testing</h1>
              {fakeReliabilityTesting.map((test) => {
                return (
                  <div className="flex gap-4 px-4 py-1">
                    {test.status === "p" ? (
                      <span className="min-w-[25px] h-[25px] bg-green rounded-xl"></span>
                    ) : (
                      <span className="min-w-[25px] h-[25px] bg-fail rounded-xl"></span>
                    )}
                    <div className="flex flex-col gap-0">
                      <p>{test.test}</p>
                      <p className="text-sm text-gray-500">
                        Accuracy: {test.accuracy}
                      </p>
                    </div>
                    <span className="text-gray-500">{test.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col border border-gray-300 gap-2 border-1 rounded-xl pb-2">
              <h1 className="text-2xl p-4 underline">Performance Testing</h1>
              <div className="grid grid-cols-2 gap-y-4">
                {fakePerformanceTesting.map((test) => {
                  return (
                    <div className="px-4 py-1">
                      <div className="flex flex-col gap-0">
                        <p className="font-semibold">{test.title}</p>
                        <p className="text-sm">{test.iterations} iteration/s</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AccordionItem> */}
      </ControlledAccordion>
    </div>
  );
};

export default AccordionTop;
