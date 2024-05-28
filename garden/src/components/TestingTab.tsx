import { AccordionItem } from "@szhsin/react-accordion";

const TestingTab = () => {
  const fakeSoftwareTesting = [
    {
      test: "Python 3.9 - GPU",
      status: "p",
      date: "3 days ago",
    },
    {
      test: "Python 3.9 - CPU",
      status: "p",
      date: "3 days ago",
    },
    {
      test: "Python 3.8 - GPU",
      status: "f",
      date: "3 days ago",
    },
  ];
  const fakeReliabilityTesting = [
    {
      test: "LIGO Validation Set 1",
      status: "p",
      date: "5 minutes ago",
      accuracy: "0.95",
    },
    {
      test: "LIGO Training Set",
      status: "p",
      date: "1 day ago",
      accuracy: "1.0",
    },
    {
      test: "LIGO Validation Set 2",
      status: "f",
      date: "2 days ago",
      accuracy: "0.85",
    },
  ];
  const fakePerformanceTesting = [
    {
      title: "CPU",
      iterations: 20,
    },
    {
      title: "GPU",
      iterations: 100,
    },
    {
      title: "Hardware Accelerator",
      iterations: 500,
    },
  ];

  return (
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
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
        </div>
      )}
      buttonProps={{
        className: ({ isEnter }) => `w-full hover:bg-gray-100 ${isEnter && "bg-gray-100"}`,
      }}
    >
      <div className="grid grid-cols-1 gap-x-12 gap-y-12 px-8 py-4 md:grid-cols-2 lg:gap-x-32 lg:px-16">
        <div className="border-1 flex flex-col gap-2 rounded-xl border border-gray-300 pb-2">
          <h1 className="p-4 text-2xl underline">Software Testing</h1>
          {fakeSoftwareTesting.map((test) => {
            return (
              <div className="flex items-center gap-4 px-4 py-1">
                {test.status === "p" ? (
                  <span className="h-[25px] min-w-[25px] rounded-xl bg-green"></span>
                ) : (
                  <span className="h-[25px] min-w-[25px] rounded-xl bg-fail"></span>
                )}
                <p>{test.test}</p>
                <span className="text-gray-500">{test.date}</span>
              </div>
            );
          })}
        </div>
        <div className="border-1 flex flex-col gap-2 rounded-xl border border-gray-300 pb-2">
          <h1 className="p-4 text-2xl underline">Reliability Testing</h1>
          {fakeReliabilityTesting.map((test) => {
            return (
              <div className="flex gap-4 px-4 py-1">
                {test.status === "p" ? (
                  <span className="h-[25px] min-w-[25px] rounded-xl bg-green"></span>
                ) : (
                  <span className="h-[25px] min-w-[25px] rounded-xl bg-fail"></span>
                )}
                <div className="flex flex-col gap-0">
                  <p>{test.test}</p>
                  <p className="text-sm text-gray-500">Accuracy: {test.accuracy}</p>
                </div>
                <span className="text-gray-500">{test.date}</span>
              </div>
            );
          })}
        </div>
        <div className="border-1 flex flex-col gap-2 rounded-xl border border-gray-300 pb-2">
          <h1 className="p-4 text-2xl underline">Performance Testing</h1>
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
    </AccordionItem>
  );
};

export default TestingTab;
