import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import AccordionTop from "../components/AccordionTop";
import DatasetBoxEntrypoint from "../components/DatasetBoxEntrypoint";
import { searchGardenIndex } from "../globusHelpers";
import Breadcrumbs from "../components/Breadcrumbs";
import { NotebookViewer } from "../components/NotebookViewer";
import { ExampleFunction } from "../components/ExampleFunction";
import SyntaxHighlighter from "react-syntax-highlighter";
// import OpenInButtons from "../components/OpenInButtons";
// import CitePinButtons from "../components/CitePinButtons";
// import EntrypointMetrics from "../components/EntrypointMetrics";
// import DiscussionTabContent from "../components/DiscussionTabContent";
// import DiscussionTab from "../components/DiscussionTab";

const EntrypointPage = ({ bread }: { bread: any }) => {
  const { doi } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [active, setActive] = useState("");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [stepsOverflow, setStepsOverflow] = useState(false);
  const [pClass, setPClass] = useState("overflow-x-hidden whitespace-nowrap");
  const [buttonIndex, setButtonIndex] = useState(0);
  const [result, setResult] = useState<any>(undefined);
  const [gardenDOI, setGardenDOI] = useState("");
  const [showFoundry, setShowFoundry] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const widthRef = useRef<HTMLParagraphElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLButtonElement>(null);
  const div = useRef<HTMLDivElement>(null);

  //These two functions determine if overflow is happening so it can be handled
  useEffect(() => {
    if (widthRef.current) {
      const container = widthRef.current;
      if (container!.offsetWidth < container!.scrollWidth) {
        setIsOverflowing(true);
      }
    }
  }, []);

  const checkStepOverflow = () => {
    if (div.current) {
      const contain = div.current;
      if (contain!.clientHeight < contain!.scrollHeight && stepsOverflow === false) {
        setStepsOverflow(true);
      }
    }
  };

  const exampleFunctionText = (
    gardenDOI: string,
    entrypoint: {
      test_functions: Array<string>;
      doi: string;
      short_name?: string;
    },
  ): string => {
    const prefixText = `from garden_ai import GardenClient
client = GardenClient()
garden = client.get_published_garden("${gardenDOI}")
\n`;

    // Ideally we have a test function and we can display that.
    if (entrypoint.test_functions.length > 0) {
      let functionText = entrypoint.test_functions[0];
      // The test function writer called it by its short name,
      // but the consumer will call it by garden.short_name
      if (entrypoint.short_name) {
        functionText = functionText.replaceAll(entrypoint.short_name, `garden.${entrypoint.short_name}`);
      }
      const fullFunction = prefixText + functionText;

      // Remove the @entrypoint_test decorator if it's in this snippet
      const lines = fullFunction.split("\n");
      const filteredLines = lines.filter((line) => !line.trim().startsWith("@entrypoint_test"));
      return filteredLines.join("\n");
    }
    // If we don't have a test function,
    // we can use a generic template that shows how to call the entrypoint.
    let fallbackFunction = prefixText + `input = ['Data Here']\n`;
    if (entrypoint.short_name) {
      fallbackFunction += `return garden.${entrypoint.short_name}(input)`;
    } else {
      fallbackFunction += `my_entrypoint = next(e for e in garden.entrypoints if e.doi == ${entrypoint.doi})
return my_entrypoint(input)`;
    }

    return fallbackFunction;
  };

  //API call to get the data based on the doi of the entrypoint
  useEffect(() => {
    async function Search() {
      try {
        const gmetaArray = await searchGardenIndex({ q: doi || "" });
        const selectedGarden = gmetaArray[0].entries[0].content;
        const selectedEntrypoint = selectedGarden.entrypoints.filter((pipe: any) => pipe.doi === doi);
        setResult(selectedEntrypoint);
        setGardenDOI(selectedGarden.doi);
      } catch (error) {
        setResult([]);
        setGardenDOI("");
      }
    }
    Search();
  }, [doi]);

  //Loading screen while the call waits to return
  if (result === undefined) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <svg
          className="mr-2 h-24 w-24 animate-spin fill-green text-gray-200"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }

  //The doi does not match up to a entrypoint, message appears
  if (result.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-green font-display">
        <div className="flex min-h-[50vh] w-[75vw] flex-col items-center rounded-xl border border-black bg-white sm:w-[50vw]">
          <h1 className=" px-4 py-12 text-center text-4xl font-semibold">No Entrypoint Found</h1>
          <p className="px-4 text-center">The page you were looking for does not exist</p>
          <button
            className="mt-16 rounded-lg border border-green bg-green px-4 py-3 text-white shadow-lg hover:border-black hover:shadow-xl"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  const text = doi?.replace("/", "%2f");
  bread.entrypoint = [result[0].title, `/entrypoint/${text}`];

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showTooltip();
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(exampleFunctionText(gardenDOI, result[0]));
    showTooltip();
  };

  const showTooltip = () => {
    if (tooltipVisible === false) {
      setTooltipVisible(true);
      setTimeout(() => {
        setTooltipVisible(false);
      }, 3000);
    }
  };

  const showModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  //Show more/show less functionality
  const contributorMore = () => {
    setPClass("");
    setIsOverflowing(false);
    setHasOverflow(true);
  };

  const contributorLess = () => {
    setPClass("overflow-x-hidden whitespace-nowrap");
    setIsOverflowing(true);
    setHasOverflow(false);
  };

  //scroll button for steps tab if there is overflow
  const scrollToBottom = () => {
    div.current?.scrollTo({
      top: div.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    div.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const foundry = () => {
    setShowFoundry(true);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col gap-12 px-4 pb-2 pt-12 font-display sm:px-16 sm:pt-24 lg:px-36">
        {/* Place breadcrumbs here */}
        <Breadcrumbs crumbs={bread} />
        {/* Entrypoint Header */}
        <div className="flex flex-col gap-1">
          <div className="gap4 flex sm:gap-8">
            <h1 className="font-display text-2xl sm:text-3xl">{result[0].title}</h1>
            <div className="flex items-center gap-4">
              <button title="Copy link" onClick={copy}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.0}
                  stroke="gray"
                  className="h-6 w-6 text-gray-700 hover:cursor-pointer hover:text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
              </button>
              <button title="Share" onClick={showModal}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.0}
                  stroke="gray"
                  className="h-6 w-6 text-gray-700 hover:cursor-pointer hover:text-gray-500"
                >
                  <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
              {/* Pin and Cite buttons to be added later */}
              {/* <CitePinButtons/> */}
              {tooltipVisible && (
                <p className="fixed right-[35vw] top-[10vh] z-50 min-w-[10vw] rounded-lg bg-green p-2 text-center text-white sm:right-[45vw]">
                  Copied to Clipboard
                </p>
              )}
              <Modal show={show} close={closeModal} copy={copy} doi={result[0].doi} showTooltip={showTooltip} />
              Enpoinsx
            </div>
          </div>
          <div className="flex flex-wrap gap-1 text-sm text-gray-500">
            <span>Version {result[0].version}</span>
            <span>|</span>
            <span>{result[0].year}</span>
            {result[0].tags.length > 0 ? (
              <>
                <span>|</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 28 28"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                <div>
                  {result[0].tags
                    .map((t: any) => <span>{t}</span>)
                    .reduce((prev: any, curr: any) => [prev, ", ", curr])}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          {/* Total Runs/Pins/Shares/Citations goes here */}
          {/* <EntrypointMetrics/> */}
          <div className="mr-8 flex flex-wrap pt-4 text-base sm:text-lg">
            <p className="pr-2 font-semibold">Contributors:</p>
            <p className={pClass} ref={widthRef}>
              {result[0].authors
                .map((author: any) => {
                  return <span>{author}</span>;
                })
                .reduce((prev: any, curr: any) => [prev, ", ", curr])}
              {hasOverflow ? (
                <button className="whitespace-nowrap pl-2 text-blue hover:underline" onClick={contributorLess}>
                  {" "}
                  ...see less
                </button>
              ) : (
                <></>
              )}
            </p>
            <div>
              {isOverflowing ? (
                <button className="whitespace-nowrap text-blue hover:underline" onClick={contributorMore}>
                  ...see more
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="pl-4">
          <div className="flex flex-row">
            <div className="flex w-full items-center border-b border-gray-300 text-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="mr-2 h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              At a glance
            </div>
          </div>
          <p className="p-4">{result[0].description}</p>
        </div>

        <div className="flex w-full flex-col gap-8">
          <h2 className="text-center text-2xl sm:text-3xl">Run this entrypoint</h2>
          <div className="justify-center pt-2 sm:flex">
            <ExampleFunction functionText={exampleFunctionText(gardenDOI, result[0])} />

            <div className="flex flex-col items-center justify-center">{/* <OpenInButtons/> */}</div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-center">Copy Code:</p>
            <button title="Copy Code" onClick={copyCode} className="flex w-full items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="gray"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">{/* <OpenInButtons/> */}</div>
        </div>
        <div className="mt-0 flex justify-center pt-0">
          <p>
            To run this entrypoint, you need to be a part of{" "}
            <a
              className="text-green underline"
              target="_blank"
              href=" https://app.globus.org/groups/53952f8a-d592-11ee-9957-193531752178/about"
            >
              this Globus group
            </a>
          </p>
        </div>
      </div>

      <AccordionTop entrypoint={result} />

      <div className="pb-12">
        <div className="flex h-12 justify-evenly ">
          <button
            className={
              active === "Steps"
                ? "w-full border-b-4 border-green bg-green bg-opacity-30"
                : active === ""
                  ? "w-full border-b-4 border-green bg-green bg-opacity-30"
                  : "hover:border-b-1 w-full bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"
            }
            onClick={() => setActive("")}
          >
            Steps
          </button>
          {/* Discussion Tab here */}
          {/* <DiscussionTab active={active} setActive={setActive}/> */}
          <button
            className={
              active === "Notebook"
                ? "w-full border-b-4 border-green bg-green bg-opacity-30"
                : "hover:border-b-1 w-full bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"
            }
            onClick={() => setActive("Notebook")}
          >
            Notebook
          </button>
          <button
            className={
              active === "Datasets"
                ? "w-full border-b-4 border-green bg-green bg-opacity-30"
                : "hover:border-b-1 w-full bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"
            }
            onClick={() => setActive("Datasets")}
          >
            Datasets
          </button>
        </div>
        <div className="pt-4 sm:pt-8">
          {active === "" && (
            <div className="inline-grid grid-cols-5 sm:grid">
              <div
                className="bg-gray col-span-full h-full max-h-[200px] overflow-y-scroll sm:col-span-2 sm:max-h-[650px] lg:col-span-1"
                id="step_scroll"
                ref={div}
              >
                {stepsOverflow ? (
                  <button
                    className="ml-[32%] w-[36%] rounded-xl bg-green p-1 px-2 text-xs text-white hover:border-2 hover:border-black sm:ml-[13%] sm:w-[74%] sm:text-base "
                    ref={top}
                    onClick={() => scrollToBottom()}
                  >
                    Scroll to bottom
                  </button>
                ) : (
                  <></>
                )}
                {result[0].steps.map((step: any, index: number) => {
                  return (
                    <div className="px-4">
                      {index > 0 ? (
                        <div className="flex justify-center">
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
                              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                            />
                          </svg>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div
                        className={
                          buttonIndex === index
                            ? "my-2 flex w-full justify-center border-4 border-gray-400 bg-gray-100 text-center sm:my-4"
                            : "border-1 my-2 flex w-full justify-center border border-gray-400 text-center sm:my-4"
                        }
                      >
                        <button className="w-full" onClick={() => setButtonIndex(index)}>
                          <p className="break-all p-2 sm:p-4">{step.function_name}</p>
                        </button>
                      </div>
                    </div>
                  );
                })}
                {stepsOverflow ? (
                  <button
                    className="ml-[32%] w-[36%] rounded-xl bg-green p-1 px-2 text-xs text-white hover:border-2 hover:border-black sm:ml-[13%] sm:w-[74%] sm:text-base"
                    onClick={() => scrollToTop()}
                  >
                    Scroll to top
                  </button>
                ) : (
                  <></>
                )}
                {checkStepOverflow()}
                <div ref={bottom}></div>
              </div>
              <div className="border-gray col-span-full my-4 whitespace-pre-line break-words border-2 p-8 sm:col-span-3 sm:my-0 lg:col-span-4">
                <div></div>
                <p className="text-md pb-6 pt-8 font-semibold lg:text-xl">{result[0].steps[buttonIndex].description}</p>
                <SyntaxHighlighter language="python">{result[0].steps[buttonIndex].function_text}</SyntaxHighlighter>
              </div>
            </div>
          )}
          {/* Discussion Tab Content here */}
          {/* {active === "Discussion" && (
              <DiscussionTabContent active={active} comments={fakeComments}/>
            )} */}
          {active === "Notebook" && (
            <div className="px-6">
              <p>This notebook contains the definition of this entrypoint, tagged with @garden_entrypoint.</p>
              <p className="mb-6">
                When you execute the entrypoint, it runs in a Python session created by running every cell in this
                notebook once.
              </p>
              <NotebookViewer notebookURL={result[0].notebook_url} />
            </div>
          )}
          {active === "Datasets" && (
            <div className="px-6">
              <div>
                <h1 className="py-8 text-2xl underline">Datasets used in this entrypoint</h1>
                {result[0].datasets?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 py-4 sm:gap-12 md:grid-cols-2 lg:px-24">
                    {result[0].datasets.map((dataset: any) => (
                      <DatasetBoxEntrypoint dataset={dataset} showFoundry={foundry} />
                    ))}
                  </div>
                ) : (
                  <p className="pb-16 pt-8 text-center text-xl">No datasets available for this entrypoint</p>
                )}
                {showFoundry === true ? (
                  <div>
                    <p className="mx-6 pb-4 text-base sm:mx-16 sm:text-xl">
                      *One or more of these datasets uses Foundry, here is how you can view it:
                    </p>
                    <div className="rounded-xl bg-gray-800 py-6 pl-6 text-white sm:mx-8 lg:mx-32">
                      <code className="leading-loose">
                        <span className="text-gray-400">
                          # Make sure you've imported and instantiated foundry <br />
                        </span>
                        <span className="text-purple">from</span> foundry <span className="text-purple">import</span>{" "}
                        Foundry <br />
                        f = Foundry()
                        <br />
                        <br />
                        <span className="text-gray-400">
                          # Load the data here <br />
                        </span>
                        f.load(
                        <span className="text-green">'DOI goes here'</span>, globus=
                        <span className="text-orange">False</span>)
                        <br />
                        res = f.load_data()
                      </code>
                    </div>
                    <p className="mx-6 pt-8 text-base sm:mx-16 sm:text-xl">
                      New to Foundry or need a refresher? Click{" "}
                      <a
                        target="blank"
                        href="https://ai-materials-and-chemistry.gitbook.io/foundry/"
                        className="text-blue hover:underline"
                      >
                        here
                      </a>{" "}
                      to learn more.
                    </p>
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EntrypointPage;
