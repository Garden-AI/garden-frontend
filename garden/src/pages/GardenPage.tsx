import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PipelineBox from "../components/PipelineBox";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

const GardenPage = () => {
  const { uuid } = useParams();
  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);
  console.log(uuid);
  const fakeData = {
    uuid: "91b35f79-2639-44e4-8323-6cfcav1b9592",
    name: "Crystal Garden",
    doi: "10.3792.1234",
    pipelines: [
      "10.2345.55555",
      "10.2345.55556",
      "10.2345.55557",
      "10.2345.55558",
    ],
    description: "Models for predicting crystal structure",
    authors: ["KJ Schmidt, Will Engler, Owen Price Skelly, Ben B"],
  };

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Text copied");
  };

  const showModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false)
  }

  return (
    <>
      <Navbar />
      <div className="h-full w-full flex flex-col gap-10 px-16 md:px-36 py-20 font-display">
        {/* Place breadcrumbs here */}

        {/* Garden Header */}
        <div className="flex gap-8">
          <h1 className="text-3xl">{fakeData.name}</h1>
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
            <Modal show={show} close={closeModal} copy={copy} doi={fakeData.doi}/>
          </div>
        </div>

        {/* Garden Overview */}
        <div className="border-0 rounded-lg bg-gray-100 flex flex-col gap-5 p-4 text-sm text-gray-700">
          <div>
            <h2 className="font-semibold">Contributors</h2>
            <p>{fakeData.authors}</p>
          </div>
          <div>
            <h2 className="font-semibold">DOI</h2>
            <a
              href={`https://doi.org/${fakeData.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fakeData.doi}
            </a>
          </div>
          <div>
            <h2 className="font-semibold">Description</h2>
            <p>{fakeData.description}</p>
          </div>
        </div>

        <div></div>

        <div>
          {/* Tabs */}
          <div className="flex justify-evenly h-12 ">
            <button
              className={
                active === "Pipelines"
                  ? "bg-gray-300 w-full border-r-4 border-black"
                  : active === ""
                  ? "bg-gray-300 w-full border-r-4 border-black"
                  : "bg-gray-100 w-full border-r-4 border-black hover:bg-gray-300"
              }
              onClick={() => setActive("Pipelines")}
            >
              Pipelines
            </button>
            <button
              className={
                active === "Discussion"
                  ? "bg-gray-300 w-full border-r-4 border-black"
                  : "bg-gray-100 w-full border-r-4 border-black hover:bg-gray-300"
              }
              onClick={() => setActive("Discussion")}
            >
              Discussion
            </button>
            <button
              className={
                active === "Datasets"
                  ? "bg-gray-300 w-full"
                  : "bg-gray-100 w-full hover:bg-gray-300"
              }
              onClick={() => setActive("Datasets")}
            >
              Datasets
            </button>
          </div>
          <div className="pt-8">
            {active === "" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fakeData.pipelines.map((pipeline) => (
                  <PipelineBox key={pipeline} doi={pipeline} />
                ))}
              </div>
            )}
            {active === "Pipelines" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fakeData.pipelines.map((pipeline) => (
                  <PipelineBox key={pipeline} doi={pipeline} />
                ))}
              </div>
            )}
            {active === "Discussion" && <p>Discussion</p>}
            {active === "Datasets" && <p>Datasets</p>}
          </div>
        </div>

        {/* Pipelines Gallery */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fakeData.pipelines.map((pipeline) => (
            <PipelineBox key={pipeline} doi={pipeline} />
          ))}
        </div> */}
      </div>
    </>
  );
};

export default GardenPage;
