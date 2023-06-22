import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import AccordionTop from "../components/AccordionTop";
import AccordionSteps from "../components/AccordionSteps";
import {
  ControlledAccordion,
  useAccordionProvider,
} from "@szhsin/react-accordion";
import CommentBox from "../components/CommentBox";
import RelatedGardenBox from "../components/RelatedGardenBox";

const PipelinePage = () => {
  const { uuid } = useParams();
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("");
  const [showComment, setShowComment] = useState(true);
  const providerValue = useAccordionProvider({
    allowMultiple: true,
  });
  const { toggleAll } = providerValue;
  console.log(uuid);
  const fakeData = {
    uuid: "a5f9f612-28ee-4ba7-a104-dc8a70613ea2",
    name: "Crystal Structure Predictor",
    doi: "10.3792.1234",
    funcxID: "abcdefg",
    description: "This is a pipeline for predicting crystal structure!",
    authors: ["KJ Schmidt, Ben B"],
    repository: "https://github.com/",
    steps: [
      {
        input_info: "{'input_data': <class 'object'>}",
        func: "preprocessing_step: (input_data: object) -> object",
        python_version: null,
        description: " ",
        contributors: [],
        output_info: "return: <class 'object'>",
        title: "preprocessing_step",
        uuid: "abc4356e-b845-42f8-8276-fa2e6de7b3e5",
        conda_dependencies: [],
        authors: [],
        pip_dependencies: [],
      },
      {
        input_info: "{'data': <class 'object'>}",
        func: "another_step: (data: object) -> object",
        python_version: null,
        description: null,
        contributors: [],
        output_info: "return: <class 'object'>",
        title: "another_step",
        uuid: "9015f3b0-fa71-4673-b3e4-fd80977a5a78",
        conda_dependencies: [],
        authors: [],
        pip_dependencies: [],
      },
      {
        input_info: "{'input_arg': <class 'object'>}",
        func: "run_inference: (input_arg: object) -> object",
        python_version: null,
        description: null,
        contributors: [],
        output_info: "return: <class 'object'>",
        title: "run_inference",
        uuid: "bb71b032-c9dd-4dd0-9667-b0e9302f8218",
        conda_dependencies: [],
        authors: [],
        pip_dependencies: [],
      },
    ],
    version: "0.0.1",
    year: 2023,
    tags: ["fun", "cool", "pipeline"],
  };
  const fakeComments = [
    {
      user: "Chase Jenkins",
      type: "Comment",
      title: "This is a great garden",
      body: "I love this garden! It's very well done, and I was able to take a look at the models and was very impressed with what I saw. I am definilty going to have to share this with some friends and colleagues.",
      upvotes: 150,
      downvotes: 50,
      replies: [
        {
          user: "Chase Two",
          body: "I agree",
        },
        {
          user: "Chase Three",
          body: "It is a great garden",
        },
        {
          user: "Chase Four",
          body: "Well said",
        },
        {
          user: "Chase Five",
          body: "Just came from the link you sent me! Thanks for sharing",
        },
        {
          user: "Chase Six",
          body: "You are so right",
        },
      ],
    },
    {
      user: "Jenkins Chase",
      type: "Comment",
      title: "This garden is very relevant to my work!",
      body: "I'm going to use this! I also work in this field and have been looking for models that I can easily use for quite some time now. This is excellent work and I'm glad I came across it",
      upvotes: 150,
      downvotes: 50,
      replies: [
        {
          user: "Chase Two",
          body: "Me too",
        },
        {
          user: "Chase Three",
          body: "This also relates to my work",
        },
      ],
    },
    {
      user: "Jenkins Chase",
      type: "Question",
      title: "What are crystals?",
      body: "I was just exploring this site, and came across this garden. It looks very interesting, but I have no idea what crystals are in this context? Could anyone explain?",
      upvotes: 150,
      downvotes: 50,
      replies: [
        {
          user: "Chase Two",
          body: "Crystal structure is a description of the ordered arrangement of atoms, ions, or molecules in a crystalline material.",
        },
        {
          user: "Chase Three",
          body: "I had the same question",
        },
      ],
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

  const commentFilter = () => {
    return fakeComments
      .filter((comment) => comment.type === "Comment")
      .map((comment) => <CommentBox key={comment.body} comment={comment} />);
  };

  const questionFilter = () => {
    return fakeComments
      .filter((comment) => comment.type === "Question")
      .map((comment) => <CommentBox key={comment.body} comment={comment} />);
  };

  return (
    <>
      <div className="h-full w-full flex flex-col gap-12 px-4 sm:px-16 lg:px-36 py-24 font-display">
        {/* Place breadcrumbs here */}

        {/* Pipeline Header */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-8">
            <h1 className="text-3xl font-serif">{fakeData.name}</h1>
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
                    // strokeLinecap="round"
                    // strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              </button>
              {/* <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill='none'
                  viewBox="0 0 448 512"
                  className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer"
                >
                  <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z" />
                </svg>
              </button> */}
              <Modal
                show={show}
                close={closeModal}
                copy={copy}
                doi={fakeData.doi}
              />
            </div>
          </div>
          <div className="text-gray-500 text-sm flex gap-1">
            <span>Version {fakeData.version}</span>
            <span>|</span>
            <span>{fakeData.year}</span>
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
              {fakeData.tags
                .map<React.ReactNode>((t) => <span>{t}</span>)
                .reduce((prev, curr) => [prev, ", ", curr])}
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="border-0 rounded-lg bg-gray-100 flex flex-col gap-5 p-4 text-sm text-gray-700">
          <div>
            <h2 className="font-semibold">Contributors</h2>
            <p>{fakeData.authors}</p>
          </div>
          <div>
            <h2 className="font-semibold">DOI</h2>
            <p>{fakeData.doi}</p>
          </div>
          <div>
            <h2 className="font-semibold">Description</h2>
            <p>{fakeData.description}</p>
          </div>
          <div>
            <h2 className="font-semibold">GitHub Repository</h2>
            <a
              href={fakeData.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fakeData.repository}
            </a>
          </div>
        </div>

        <AccordionTop />
        {/* Run Pipeline */}
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl text-center">Run this pipeline</h2>
          <div className="sm:flex justify-center py-2 lg:pr-24 gap-20">
            <div className="bg-gray-800 text-white py-6 px-6 rounded-xl">
              <code className="leading-loose">
                <span className="text-purple">from</span> garden_sdk{" "}
                <span className="text-purple">import</span> GardenClient <br />
                gc = GardenClient()
                <br />
                <br />
                id = <span className="text-green">"{fakeData.doi}"</span>
                <br />
                gc.<span className="text-orange">run</span>(id, my_data)
              </code>
            </div>

            <div className="flex flex-col">
              <a
                href="https://wholetale.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green shadow-sm rounded-lg hover:shadow-md p-5 my-2 items-center justify-between hover:no-underline"
              >
                <span className="text-center text-xl text-green">
                  Open in Whole Tale
                </span>
              </a>
              <a
                href="https://huggingface.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green shadow-sm rounded-lg hover:shadow-md p-5 my-2 items-center justify-between hover:no-underline"
              >
                <span className="text-center text-xl text-green">
                  Open in HuggingFace
                </span>
              </a>
              <a
                href="https://colab.research.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green shadow-sm rounded-lg hover:shadow-md p-5 my-2 items-center justify-between hover:no-underline"
              >
                <span className="text-center text-xl text-green">
                  Open in Google Colab
                </span>
              </a>
            </div>
          </div>
          {/* For inserting code blocks, consider: https://github.com/rajinwonderland/react-code-blocks#-demo */}
        </div>

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
              onClick={() => setActive("Steps")}
            >
              Steps
            </button>
            <button
              className={
                active === "Discussion"
                  ? "bg-green bg-opacity-30 w-full border-b-4 border-green"
                  : "bg-gray-100 w-full hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green hover:border-b-1 hover:border-green"
              }
              onClick={() => setActive("Discussion")}
            >
              Discussion
            </button>
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
            {active === "" && (
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
                  className="px-12"
                >
                  {fakeData.steps.map((step, index) => (
                    <AccordionSteps step={step} index={index} />
                  ))}
                </ControlledAccordion>
              </div>
            )}
            {active === "Steps" && (
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
                  className="px-12"
                >
                  {fakeData.steps.map((step, index) => (
                    <AccordionSteps step={step} index={index} />
                  ))}
                </ControlledAccordion>
              </div>
            )}

            {active === "Discussion" && (
              <div className="mx-16">
                <div className="flex pb-6 gap-6">
                  <button
                    className={
                      showComment === true
                        ? " bg-green text-white border border-1 border-white w-max px-3 rounded-2xl"
                        : "border border-1 border-black w-max px-3 rounded-2xl"
                    }
                    onClick={() => setShowComment(true)}
                  >
                    <p>Comments</p>
                  </button>
                  <button
                    className={
                      showComment === false
                        ? " bg-green text-white border border-1 border-white w-max px-3 rounded-2xl"
                        : "border border-1 border-black w-max px-3 rounded-2xl"
                    }
                    onClick={() => setShowComment(false)}
                  >
                    <p>Questions</p>
                  </button>
                </div>
                {showComment === true ? commentFilter() : questionFilter()}
              </div>
            )}

            {active === "Related" && (
              <div className="px-6">
                <h1 className="underline text-2xl pb-8">
                  Appears in these other Gardens
                </h1>
                <div className=" grid grid-cols-1 gap-2 md:grid-cols-2 sm:gap-12 lg:px-24">
                  <RelatedGardenBox />
                  <RelatedGardenBox />
                  <RelatedGardenBox />
                  <RelatedGardenBox />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Steps */}
        <div>
          {/* Considering https://szhsin.github.io/react-accordion/ for the accordion tabs */}
          {/* <h2 className='text-3xl text-center'>Explore its steps</h2> */}
        </div>
      </div>
    </>
  );
};

export default PipelinePage;
