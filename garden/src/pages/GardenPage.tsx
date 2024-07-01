import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EntrypointBox from "../components/EntrypointBox";
import Modal from "../components/Modal";
import RelatedGardenBox from "../components/RelatedGardenBox";
import Breadcrumbs from "../components/Breadcrumbs";
import DatasetBoxEntrypoint from "../components/DatasetBoxEntrypoint";
import { useSearchGardenByDOI, useSearchGardens } from "../api/search";
import { Garden } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const GardenPage = ({ bread }: { bread: any }) => {
  const { doi } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);
  const [showFoundry, setShowFoundry] = useState(false);
  const [datasets, setDatasets] = useState<Array<Object>>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const {
    data: garden,
    isLoading: gardenIsLoading,
    isError: gardenIsError,
  } = useSearchGardenByDOI(doi!);
  const {
    data: relatedGardens,
    isLoading: relatedGardensIsLoading,
    isError: relatedGardensIsError,
  } = useSearchGardens("*", "6", doi!);

  if (gardenIsLoading) {
    return <LoadingSpinner />;
  }
  //If no garden is associated with the DOI in the URL, not found page comes up
  if (gardenIsError || !garden) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-green font-display">
        <div className="flex min-h-[50vh] w-[75vw] flex-col items-center rounded-xl border border-black bg-white sm:w-[50vw]">
          <h1 className=" px-4 py-12 text-center text-4xl font-semibold">
            No Garden Found
          </h1>
          <p className="px-4 text-center">
            The page you were looking for does not exist
          </p>
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
  bread.garden = [garden.title, `/garden/${text}`];
  bread.entrypoint = [];

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showTooltip();
  };

  const copyDOI = async () => {
    const DOItext: string = doi?.replace("/", "%2f") ?? "";

    try {
      await navigator.clipboard.writeText(DOItext);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
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

  //Scroll functionality for the related gardens section
  const leftScroll = () => {
    let sc = document.querySelector("#related");
    sc!.scrollLeft = sc!.scrollLeft - 287;
  };

  const rightScroll = () => {
    let sc = document.querySelector("#related");
    sc!.scrollLeft = sc!.scrollLeft + 287;
  };

  const NoDatasets = () => (
    <p className="col-span-2 pb-16 pt-8 text-center text-base sm:text-xl">
      No datasets available for this garden
    </p>
  );

  const foundry = () => {
    setShowFoundry(true);
  };

  return (
    <div className="font-display">
      <div
        autoFocus
        className="flex h-full w-full flex-col gap-10 px-6 py-12 font-display sm:px-16 sm:py-20 md:px-36"
      >
        {/* Place breadcrumbs here */}
        <Breadcrumbs crumbs={bread} />
        {/* Garden Header */}
        <div className="flex gap-4 sm:gap-8">
          <h1 className="text-2xl sm:text-3xl">{garden.title}</h1>
          <div className="flex items-center gap-3">
            <button title="Copy link" onClick={copy}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-700 hover:cursor-pointer hover:text-gray-500 sm:h-6 sm:w-6"
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
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-700 hover:cursor-pointer hover:text-gray-500 sm:h-6 sm:w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
            </button>
            {tooltipVisible && (
              <p className="fixed right-[35vw] top-[10vh] z-50 min-w-[10vw] rounded-lg bg-green p-2 text-center text-white sm:right-[45vw]">
                Copied to Clipboard
              </p>
            )}
            <Modal
              show={show}
              close={closeModal}
              copy={copy}
              doi={garden.doi}
              showTooltip={showTooltip}
            />
          </div>
        </div>

        {/* Garden Overview */}
        <div className="flex flex-col gap-5 rounded-lg border-0 bg-gray-100 p-4 text-sm text-gray-700">
          <div className="flex flex-row justify-between w-full">
            <div>
              <h2 className="font-semibold">Contributors</h2>
              <p>{garden.authors.join(",")}</p>
            </div>
            {/* add logic to only render if this garden was created by the user*/}
            <button 
                    /*onClick={}*/
                    title="Edit Garden" 
                    className="flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm"
            >
              Edit Garden
            </button>
          </div>
          <div>
            <h2 className="font-semibold">DOI</h2>
            <a
              href={`https://doi.org/${garden.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green underline"
            >
              {garden.doi}
            </a>
            <button title="Copy DOI" onClick={copyDOI} className="-mb-1 ml-2">
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
          <div>
            <h2 className="font-semibold">Description</h2>
            <p>{garden.description}</p>
          </div>
        </div>

        <div>
          {/* Tabs */}
          <div className="flex h-12 justify-evenly ">
            <button
              className={
                active === "Entrypoints"
                  ? "w-full border-b-4 border-green bg-green bg-opacity-30"
                  : active === ""
                    ? "w-full border-b-4 border-green bg-green bg-opacity-30"
                    : "hover:border-b-1 w-full bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"
              }
              onClick={() => setActive("Entrypoints")}
            >
              Entrypoints
            </button>
            {/* Discussion Tab Here */}
            {/* <DiscussionTab active={active} setActive={setDiscussionTab}/> */}
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
          <div className="pt-8">
            {active === "" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {garden.entrypoints.map((entrypoint: any) => (
                  <EntrypointBox key={entrypoint.doi} entrypoint={entrypoint} />
                ))}
              </div>
            )}
            {active === "Entrypoints" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {garden.entrypoints.map((entrypoint: any) => (
                  <EntrypointBox key={entrypoint.doi} entrypoint={entrypoint} />
                ))}
              </div>
            )}
            {/* Discussion Tab Content Here */}
            {/* <DiscussionTabContent comments={fakeComments} active={active}/> */}
            {active === "Datasets" && (
              <div>
                <div className="mx-6 pb-4 text-base sm:mx-16 sm:text-xl">
                  Below are the datasets that are used in this garden. Clicking
                  on the URL will take you to where they are hosted, and allow
                  you to learn more about them and how to view them.
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-2 pb-4 sm:gap-12 md:grid-cols-2 lg:px-24">
                    {datasets.length > 0 ? (
                      datasets.map((dataset, index: number) => (
                        <DatasetBoxEntrypoint
                          dataset={dataset}
                          showFoundry={foundry}
                          key={index}
                        />
                      ))
                    ) : (
                      <NoDatasets />
                    )}
                  </div>
                </div>
                {showFoundry === true ? (
                  <div>
                    <p className="mx-6 pb-4 text-base sm:mx-16 sm:text-xl">
                      *One or more of these datasets uses Foundry, here is how
                      you can view it:
                    </p>
                    <div className="rounded-xl bg-gray-800 py-6 pl-6 text-white sm:mx-8 lg:mx-32">
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
            )}
          </div>
        </div>
      </div>

      <h1 className=" pb-6 pl-8 text-3xl sm:pl-36 ">
        <div className="flex flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="ml-0 mr-4 h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
            />
          </svg>
          Explore Other Gardens
        </div>
      </h1>
      <div className="relative flex items-center pb-12">
        <button
          className="ml-4 mr-2 h-16 w-16 bg-gray-100 sm:ml-12 sm:mr-6"
          onClick={leftScroll}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="object-fit"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div
          id="related"
          className="inline-flex h-full w-full gap-4 overflow-x-scroll scroll-smooth whitespace-nowrap"
        >
          {relatedGardensIsLoading ? (
            <LoadingSpinner />
          ) : (
            relatedGardens &&
            relatedGardens.map((garden: Garden) => (
              <RelatedGardenBox garden={garden} key={garden.doi} />
            ))
          )}
        </div>

        <button
          className="ml-2 mr-4 h-16 w-16 bg-gray-100 sm:ml-6 sm:mr-12"
          onClick={rightScroll}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="object-fit"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GardenPage;
