import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import AccordionTop from "../components/AccordionTop";
import RelatedGardenBox from "../components/RelatedGardenBox";
import DatasetBoxPipeline from "../components/DatasetBoxPipeline";
import { fetchWithScope } from "../globusHelpers";
import { SEARCH_SCOPE, GARDEN_INDEX_URL } from "../constants";
import Breadcrumbs from "../components/Breadcrumbs";
// import OpenInButtons from "../components/OpenInButtons";
// import CitePinButtons from "../components/CitePinButtons";
// import PipelineMetrics from "../components/PipelineMetrics";
// import DiscussionTabContent from "../components/DiscussionTabContent";
// import DiscussionTab from "../components/DiscussionTab";

const PipelinePage = ({ bread }: { bread: any }) => {
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
  const [appears, setAppears] = useState<any>(undefined);
  const [showFoundry, setShowFoundry] = useState(false);
  const widthRef = useRef<HTMLParagraphElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLButtonElement>(null);
  const div = useRef<HTMLDivElement>(null);

  //These two useEffects determine if overflow is happening so it can be handled
  useEffect(() => {
    if (widthRef.current) {
      const container = widthRef.current;
      if (container!.offsetWidth < container!.scrollWidth) {
        setIsOverflowing(true);
      }
    }
  }, []);

  useEffect(() => {
    if (div.current) {
      const contain = div.current;
      if (contain!.offsetHeight < contain!.scrollHeight) {
        setStepsOverflow(true);
      }
    }
  }, []);

  //API call to get the data based on the doi of the pipeline
  useEffect(() => {
    async function Search() {
      try {
        const response = await fetchWithScope(
          SEARCH_SCOPE,
          GARDEN_INDEX_URL + `/search?q="${doi}"`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const content = await response.json();
        setResult(
          content.gmeta[0].entries[0].content.pipelines.filter(
            (pipe: any) => pipe.doi === doi
          )
        );
        setAppears(content.gmeta);
      } catch (error) {
        setResult([]);
        setAppears([]);
      }
    }
    Search();
  }, [doi]);

  //Loading screen while the call waits to return
  if (result === undefined) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <svg
          className="w-24 h-24 mr-2 text-gray-200 animate-spin fill-green"
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

  //The doi does not match up to a pipeline, message appears
  if (result.length === 0) {
    return (
      <div className="justify-center items-center flex fixed inset-0 z-50 font-display bg-green">
        <div className="w-[75vw] sm:w-[50vw] min-h-[50vh] border border-black rounded-xl bg-white flex flex-col items-center">
          <h1 className=" py-12 px-4 text-4xl font-semibold text-center">
            No Pipeline Found
          </h1>
          <p className="text-center px-4">
            The page you were looking for does not exist
          </p>
          <button
            className="bg-green text-white mt-16 border border-green rounded-lg py-3 px-4 shadow-lg hover:shadow-xl hover:border-black"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  console.log(result)
  const text = doi?.replace("/", "%2f");
  bread.pipeline = [result[0].title, `/pipeline/${text}`];

  //Garden doi for the code block
  let gardenDOI = "";
  if (bread.garden.length !== 0) {
    gardenDOI = bread.garden[1].replace("/garden/", "");
    gardenDOI = gardenDOI.replace("%2f", "/");
  } else {
    gardenDOI = appears[0].entries[0].content.doi;
  }

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
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
    bottom?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    top?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const foundry = () => {
    setShowFoundry(true);
  };

  return (
    <>
      <div className="h-full w-full flex flex-col gap-12 px-4 sm:px-16 lg:px-36 pt-24 pb-2 font-display">
        {/* Place breadcrumbs here */}
        <Breadcrumbs crumbs={bread} />
        {/* Pipeline Header */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-8">
            <h1 className="text-3xl font-display">{result[0].title}</h1>
            <div className="flex gap-4 items-center">
              <button title="Copy link" onClick={copy}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.0}
                  stroke="gray"
                  className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer"
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
                  className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer"
                >
                  <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
              {/* Pin and Cite buttons to be added later */}
              {/* <CitePinButtons/> */}
              <Modal
                show={show}
                close={closeModal}
                copy={copy}
                doi={result[0].doi}
              />
            </div>
          </div>
          <div className="text-gray-500 text-sm flex gap-1">
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
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
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
          {/* <PipelineMetrics/> */}
          <div className="sm:flex pt-4 mr-8 text-lg">
            <p className="font-semibold pr-2">Contributors:</p>
            <p className={pClass} ref={widthRef}>
              {result[0].authors
                .map((author: any) => {
                  return <span>{author}</span>;
                })
                .reduce((prev: any, curr: any) => [prev, ", ", curr])}
              {hasOverflow ? (
                <button
                  className="whitespace-nowrap text-blue hover:underline pl-2"
                  onClick={contributorLess}
                >
                  {" "}
                  ...see less
                </button>
              ) : (
                <></>
              )}
            </p>
            <div>
              {isOverflowing ? (
                <button
                  className="whitespace-nowrap text-blue hover:underline"
                  onClick={contributorMore}
                >
                  ...see more
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="pl-4">
          <p className=" border-b border-gray-300 text-2xl">
            &#128064; At a glance
          </p>
          <p className="p-4">{result[0].description}</p>
        </div>

        <div className="flex flex-col gap-8 w-full">
          <h2 className="text-3xl text-center">Run this pipeline</h2>
          <div className="sm:flex justify-center py-2">
            <div className="bg-gray-800 text-white py-6 px-6 rounded-xl">
              <code className="leading-loose">
                <span className="text-purple">import</span> GardenClient <br />
                client = garden_ai.GardenClient()
                <br />
                <br />
                <span className="text-orange">garden</span> =
                client.get_published_garden(
                <span className="text-green">"{gardenDOI}"</span>)<br />
                <br />
                <span className="text-gray-400">
                  #The input type is {result[0].steps[0].input_info}
                </span>
                <br />
                <span className="text-orange">
                  garden.
                  <span className="text-white">{result[0].short_name}</span>
                </span>
                (<span className="text-green">'Data Here'</span>)
              </code>
            </div>

            <div className="flex flex-col items-center justify-center">
              {/* <OpenInButtons/> */}
            </div>
          </div>
        </div>

        <AccordionTop pipeline={result} />

        <div>
          <div className="flex justify-evenly h-12 ">
            <button
              className={
                active === "Steps"
                  ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
                  : active === ""
                  ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
                  : "bg-gray-100 w-full hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green hover:border-b-1 hover:border-green"
              }
              onClick={() => setActive("")}
            >
              Steps
            </button>
            {/* Discussion Tab here */}
            {/* <DiscussionTab active={active} setActive={setActive}/> */}
            <button
              className={
                active === "Related"
                  ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
                  : "bg-gray-100 w-full hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green hover:border-b-1 hover:border-green"
              }
              onClick={() => setActive("Related")}
            >
              Related
            </button>
          </div>
          <div className="pt-8">
            {/* Side panel steps tab */}
            {active === "" && (
              <div className="grid grid-cols-5 h-[650px]">
                <div
                  className=" col-span-2 lg:col-span-1 bg-gray overflow-y-scroll"
                  ref={div}
                >
                  {stepsOverflow ? (
                    <button
                      className="rounded-xl bg-green p-1 px-2 mb-2 hover:border hover:border-black hover:border-2 text-white "
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
                              className="w-6 h-6"
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
                              ? "border border-4 border-gray-400 flex justify-center my-4 text-center w-full bg-gray-100"
                              : "border border-gray-400 border-1 flex justify-center my-4 text-center w-full"
                          }
                        >
                          <button onClick={() => setButtonIndex(index)}>
                            <p className="p-4 break-all">{step.title}</p>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {stepsOverflow ? (
                    <button
                      className="rounded-xl bg-green p-1 px-2 my-2 hover:border hover:border-black hover:border-2 text-white"
                      onClick={() => scrollToTop()}
                    >
                      Scroll to top
                    </button>
                  ) : (
                    <></>
                  )}
                  <div ref={bottom}></div>
                </div>
                <div className=" col-span-3 lg:col-span-4 border border-2 border-gray p-8 break-words whitespace-pre-line">
                  <h1 className="text-xl lg:text-3xl font-bold">
                    {result[0].steps[buttonIndex].title}
                  </h1>
                  <div></div>
                  <p className="pt-8 text-md lg:text-xl pb-6 font-semibold">
                    {result[0].steps[buttonIndex].description}
                  </p>
                  {/* Loop through object keys for a step and put them on the page */}
                  {Object.keys(result[0].steps[buttonIndex]).map(
                    (key, index) => {
                      if (result[0].steps[buttonIndex][key]) {
                        if (key === "title" || key === "description") {
                          return <></>;
                        }
                        if (Array.isArray(result[0].steps[buttonIndex][key])) {
                          if (result[0].steps[buttonIndex][key].length === 0) {
                            return <></>;
                          } else {
                            return (
                              <div key={index}>
                                <p className="pb-2 whitspace-normal">
                                  <span className="font-semibold text-green">
                                    {key}:{" "}
                                  </span>
                                  {result[0].steps[buttonIndex][key]
                                    .map((author: any) => <span>{author}</span>)
                                    .reduce((prev: any, curr: any) => [
                                      prev,
                                      ", ",
                                      curr,
                                    ])}
                                </p>
                              </div>
                            );
                          }
                        }
                        return (
                          <div key={index}>
                            <p className="pb-2">
                              <span className="font-semibold text-green">
                                {key}:
                              </span>{" "}
                              {result[0].steps[buttonIndex][key]}
                            </p>
                          </div>
                        );
                      } else {
                        return <></>;
                      }
                    }
                  )}
                </div>
              </div>
            )}

            {/* Discussion Tab Content here */}
            {/* {active === "Discussion" && (
              <DiscussionTabContent active={active} comments={fakeComments}/>
            )} */}

            {active === "Related" && (
              <div className="px-6">
                {appears.length > 0 ? (
                  <div>
                    <h1 className="underline text-2xl pb-8">
                      Appears in these Gardens
                    </h1>
                    <div className=" grid grid-cols-1 gap-2 md:grid-cols-2 sm:gap-12 lg:px-24">
                      {appears.map((related: any) => (
                        <RelatedGardenBox related={related} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div>
                  <h1 className="underline text-2xl py-8">
                    Datasets used in this pipeline
                  </h1>
                  {result[0].models[0].dataset ? (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 sm:gap-12 lg:px-24 py-4">
                      {/* {result[0].models[0].dataset.map((dataset: any) => {
                        return <DatasetBoxPipeline dataset={dataset} showFoundry={foundry}/>;
                      })} */}
                      <DatasetBoxPipeline dataset={result[0].models[0].dataset} showFoundry={foundry}/>
                    </div>
                  ) : (
                    <p className="text-center pt-8 pb-16 text-xl">
                      No datasets available for this pipeline
                    </p>
                  )}
                  {showFoundry === true ? (
                  <div>
                    <p className="mx-16 text-xl pb-4">
                      *One or more of these datasets uses Foundry, here is how
                      you can view it:
                    </p>
                    <div className="bg-gray-800 sm:mx-8 lg:mx-32 text-white pl-6 py-6 rounded-xl">
                      <code className="leading-loose">
                        <span className="text-gray-400">
                          # Make sure you've imported and instantiated foundry{" "}
                          <br />
                        </span>
                        <span className="text-purple">from</span> foundry{" "}
                        <span className="text-purple">import</span> Foundry{" "}
                        <br />
                        f = Foundry()
                        <br />
                        <br />
                        <span className="text-gray-400">
                          # Load the data here <br />
                        </span>
                        f.load(
                        <span className="text-green">'DOI goes here'</span>,
                        globus=<span className="text-orange">False</span>)
                        <br />
                        res = f.load_data()
                      </code>
                    </div>
                    <p className="mx-16 pt-8 text-xl">
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
      </div>
    </>
  );
};

export default PipelinePage;
