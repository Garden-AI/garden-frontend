import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PipelineBox from "../components/PipelineBox";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import RelatedGardenBox from "../components/RelatedGardenBox";
// import Breadcrumbs from "../components/Breadcrumbs";
import DatasetBox from "../components/DatasetBox";
import { fetchWithScope } from "../globusHelpers";
import { SEARCH_SCOPE, GARDEN_INDEX_URL } from "../constants";
// import DiscussionTab from "../components/DiscussionTab";
// import DiscussionTabContent from "../components/DiscussionTabContent";

const GardenPage = () => {
  const { doi } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);
  const [relatedResults, setRelatedResults] = useState<Array<any>>([])
  // const [showComment, setShowComment] = useState(true);
  const [showFoundry, setShowFoundry] = useState(false);
  const [result, setResult] = useState<any>(undefined);
  console.log(doi);
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
        setResult(content.gmeta);
      } catch (error) {
        setResult([]);
      }
    }
    Search();
  }, [doi]);

  useEffect(() => {
    async function Search() {
      try {
        const response = await fetchWithScope(
          SEARCH_SCOPE,
          GARDEN_INDEX_URL + '/search?q=2023&limit=6'
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const content = await response.json();
        setRelatedResults(content.gmeta);
      } catch (error) {
        setRelatedResults([]);
      }
    }
    Search()
    
  }, []);
  console.log('related result', relatedResults)
  console.log(result, "result");
  if (result === undefined) {
    return <div>Loading</div>;
  }
  if(result.length === 0){
    return( 
    <div className="justify-center items-center flex fixed inset-0 z-50 font-display bg-green">
      <div className="w-[75vw] sm:w-[50vw] min-h-[50vh] border border-black rounded-xl bg-white flex flex-col items-center">
        <h1 className=" py-12 px-4 text-4xl font-semibold text-center">No Garden Found</h1>
        <p className="text-center px-4">The page you were looking for does not exist</p>
        <button className="bg-green text-white mt-16 border border-green rounded-lg py-3 px-4 shadow-lg hover:shadow-xl hover:border-black" onClick={() => navigate('/home')}>
          Back to Home
        </button>
      </div>
    </div>
      )
  }
  const fakeDatasets = [
    {
      type: "dataset",
      doi: "10.3792.1234",
      repository: "Foundry",
      url: "https://foundry-ml.org/#/datasets",
    },
    {
      type: "dataset",
      doi: "10.3792.1235",
      repository: "Zenodo",
      url: "https://zenodo.org/",
    },
  ];

  

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  const showModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  const leftScroll = () => {
    let sc = document.querySelector("#related");
    sc!.scrollLeft = sc!.scrollLeft - 283;
  };

  const rightScroll = () => {
    let sc = document.querySelector("#related");
    sc!.scrollLeft = sc!.scrollLeft + 283;
  };

  const foundry = () => {
    setShowFoundry(true);
  };

  // const setDiscussionTab = () => {
  //   setActive("Discussion");
  // };

  return (
    <div className="font-display">
      <Navbar />
      <div
        autoFocus
        className="h-full w-full flex flex-col gap-10 sm:px-16 md:px-36 py-20 font-display"
      >
        {/* Place breadcrumbs here */}
        {/* <Breadcrumbs /> */}
        {/* Garden Header */}
        <div className="flex gap-8">
          <h1 className="text-3xl">{result[0]?.entries[0].content.title}</h1>
          <div className="flex gap-3 items-center">
            <button title="Copy link" onClick={copy}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
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
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
            </button>
            <Modal
              show={show}
              close={closeModal}
              copy={copy}
              doi={result[0]?.entries[0].content.doi}
            />
          </div>
        </div>

        {/* Garden Overview */}
        <div className="border-0 rounded-lg bg-gray-100 flex flex-col gap-5 p-4 text-sm text-gray-700">
          <div>
            <h2 className="font-semibold">Contributors</h2>
            <p>
              {result[0]?.entries[0].content.authors.map(
                (author: any, index: number) => (
                  <span>{author}</span>
                )
              )}
            </p>
          </div>
          <div>
            <h2 className="font-semibold">DOI</h2>
            <a
              href={`https://doi.org/${result[0]?.entries[0].content.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result[0]?.entries[0].content.doi}
            </a>
          </div>
          <div>
            <h2 className="font-semibold">Description</h2>
            <p>{result[0]?.entries[0].content.description}</p>
          </div>
        </div>

        <div></div>

        <div>
          {/* Tabs */}
          <div className="flex justify-evenly h-12 ">
            <button
              className={
                active === "Pipelines"
                  ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
                  : active === ""
                  ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
                  : "bg-gray-100 w-full hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green hover:border-b-1 hover:border-green"
              }
              onClick={() => setActive("Pipelines")}
            >
              Pipelines
            </button>
            {/* Discussion Tab Here */}
            {/* <DiscussionTab active={active} setActive={setDiscussionTab}/> */}
            <button
              className={
                active === "Datasets"
                  ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
                  : "bg-gray-100 w-full hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green hover:border-b-1 hover:border-green"
              }
              onClick={() => setActive("Datasets")}
            >
              Datasets
            </button>
          </div>
          <div className="pt-8">
            {active === "" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result[0]?.entries[0].content.pipelines.map(
                  (pipeline: any) => (
                    <PipelineBox key={pipeline.doi} pipeline={pipeline} />
                  )
                )}
              </div>
            )}
            {active === "Pipelines" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result[0]?.entries[0].content.pipelines.map(
                  (pipeline: any) => (
                    <PipelineBox key={pipeline.doi} pipeline={pipeline} />
                  )
                )}
              </div>
            )}
            {/* Discussion Tab Content Here */}
            {/* <DiscussionTabContent comments={fakeComments} active={active}/> */}
            {active === "Datasets" && (
              <div>
                <div className="mx-16 text-xl pb-4">
                  Below are the datasets that are used in this garden. Clicking
                  on the URL will take you to where they are hosted, and allow
                  you to learn more about them and how to view them.
                </div>
                <div>
                  {fakeDatasets.map((dataset) => (
                    <DatasetBox
                      key={dataset.doi}
                      dataset={dataset}
                      showFoundry={foundry}
                    />
                  ))}
                </div>
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

      <h1 className=" pl-8 sm:pl-36 text-3xl pb-6 ">Related Gardens</h1>
      <div className="relative flex items-center pb-12">
        <button
          className="w-16 h-16 ml-12 mr-6 bg-gray-100"
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
          className="w-full h-full overflow-x-scroll scroll-smooth whitespace-nowrap inline-flex gap-4"
        >
          {relatedResults.map((related) => <RelatedGardenBox related={related}/>)}
          {/* <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox /> */}
        </div>

        <button
          className="w-16 h-16 ml-6 mr-12 bg-gray-100"
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
