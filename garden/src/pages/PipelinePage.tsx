import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import AccordionTop from "../components/AccordionTop";
// import AccordionSteps from "../components/AccordionSteps";
// import {
//   ControlledAccordion,
//   useAccordionProvider,
// } from "@szhsin/react-accordion";
import CommentBox from "../components/CommentBox";
import RelatedGardenBox from "../components/RelatedGardenBox";
import Navbar from "../components/Navbar";
import DatasetBoxPipeline from "../components/DatasetBoxPipeline";

const PipelinePage = () => {
  const { uuid } = useParams();
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("");
  const [showComment, setShowComment] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [stepsOverflow, setStepsOverflow] = useState(false);
  const [pClass, setPClass] = useState("overflow-x-hidden whitespace-nowrap");
  const [buttonIndex, setButtonIndex] = useState(0);
  const widthRef = useRef<HTMLParagraphElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLButtonElement>(null);
  const div = useRef<HTMLDivElement>(null);

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

  // const providerValue = useAccordionProvider({
  //   allowMultiple: true,
  // });
  // const { toggleAll } = providerValue;
  console.log(uuid);
  const fakeData = {
    uuid: "a5f9f612-28ee-4ba7-a104-dc8a70613ea2",
    name: "Crystal Structure Predictor",
    doi: "10.3792.1234",
    funcxID: "abcdefg",
    description: "This is a pipeline for predicting crystal structure!",
    authors: [
      "KJ Schmidt",
      "Ben B",
      // "KJ Schmidt",
      // "Ben B",
      // "KJ Schmidt",
      // "Ben B",
      // "KJ Schmidt",
      // // "Ben B",
      // // "KJ Schmidt",
      // // "Ben B",
      // // "KJ Schmidt",
      // // "Ben B",
      // // "KJ Schmidt",
    ],
    repository: "https://github.com/",
    steps: [
      {
        input_info: "{'input_data': <class 'object'>}",
        func: "preprocessing_step: (input_data: object) -> object",
        python_version: null,
        description: "Step one example",
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
        description: "Step two example",
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
        description: "Step three example",
        contributors: [],
        output_info: "return: <class 'object'>",
        title: "run_inference",
        uuid: "bb71b032-c9dd-4dd0-9667-b0e9302f8218",
        conda_dependencies: [],
        authors: [],
        pip_dependencies: [],
      },
      // {
      //   input_info: "{'input_data': <class 'object'>}",
      //   func: "preprocessing_step: (input_data: object) -> object",
      //   python_version: null,
      //   description: "Step four example",
      //   contributors: [],
      //   output_info: "return: <class 'object'>",
      //   title: "preprocessing_step",
      //   uuid: "abc4356e-b845-42f8-8276-fa2e6de7b3e5",
      //   conda_dependencies: [],
      //   authors: [],
      //   pip_dependencies: [],
      // },
      // {
      //   input_info: "{'data': <class 'object'>}",
      //   func: "another_step: (data: object) -> object",
      //   python_version: null,
      //   description: "Step five example",
      //   contributors: [],
      //   output_info: "return: <class 'object'>",
      //   title: "another_step",
      //   uuid: "9015f3b0-fa71-4673-b3e4-fd80977a5a78",
      //   conda_dependencies: [],
      //   authors: [],
      //   pip_dependencies: [],
      // },
      // {
      //   input_info: "{'input_arg': <class 'object'>}",
      //   func: "run_inference: (input_arg: object) -> object",
      //   python_version: null,
      //   description: "Step six example",
      //   contributors: [],
      //   output_info: "return: <class 'object'>",
      //   title: "run_inference",
      //   uuid: "bb71b032-c9dd-4dd0-9667-b0e9302f8218",
      //   conda_dependencies: [],
      //   authors: [],
      //   pip_dependencies: [],
      // },
      // {
      //   input_info: "{'input_data': <class 'object'>}",
      //   func: "preprocessing_step: (input_data: object) -> object",
      //   python_version: null,
      //   description: "Step seven example",
      //   contributors: [],
      //   output_info: "return: <class 'object'>",
      //   title: "preprocessing_step",
      //   uuid: "abc4356e-b845-42f8-8276-fa2e6de7b3e5",
      //   conda_dependencies: [],
      //   authors: [],
      //   pip_dependencies: [],
      // },
      // {
      //   input_info: "{'data': <class 'object'>}",
      //   func: "another_step: (data: object) -> object",
      //   python_version: null,
      //   description: "Step eight example",
      //   contributors: [],
      //   output_info: "return: <class 'object'>",
      //   title: "another_step",
      //   uuid: "9015f3b0-fa71-4673-b3e4-fd80977a5a78",
      //   conda_dependencies: [],
      //   authors: [],
      //   pip_dependencies: [],
      // },
      // {
      //   input_info: "{'input_arg': <class 'object'>}",
      //   func: "run_inference: (input_arg: object) -> object",
      //   python_version: null,
      //   description: "Step nine example",
      //   contributors: [],
      //   output_info: "return: <class 'object'>",
      //   title: "run_inference",
      //   uuid: "bb71b032-c9dd-4dd0-9667-b0e9302f8218",
      //   conda_dependencies: [],
      //   authors: [],
      //   pip_dependencies: [],
      // },
    ],
    version: "0.0.1",
    year: 2023,
    tags: ["fun", "cool", "pipeline"],
  };
  const fakeComments = [
    {
      user: "Chase Jenkins",
      type: "Comment",
      title: "This is a great pipeline",
      body: "I love this pipeline! It's very well done, and I was able to take a look at the models and was very impressed with what I saw. I am definilty going to have to share this with some friends and colleagues.",
      upvotes: 150,
      downvotes: 50,
      replies: [
        {
          user: "Chase Two",
          body: "I agree",
        },
        {
          user: "Chase Three",
          body: "It is a great pipeline",
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
      title: "This pipeline is very relevant to my work!",
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
      body: "I was just exploring this site, and came across this pipeline. It looks very interesting, but I have no idea what crystals are in this context? Could anyone explain?",
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

  const fakeDatasets = [
    {
      title: "Crystal Dataset One",
      size: "5 GB",
      number: "48",
      type: ["CSV", "JPEG", "Other"],
      pluses: 75,
      doi: "10.3792.1234",
      url: "https://foundry-ml.org/#/datasets",
    },
    {
      title: "Crystal Dataset Two",
      size: "5 GB",
      number: "48",
      type: ["CSV", "JPEG", "Other"],
      pluses: 75,
      doi: "10.3792.1234",
      url: "https://foundry-ml.org/#/datasets",
    },
    {
      title: "Crystal Dataset Three",
      size: "5 GB",
      number: "48",
      type: ["CSV", "JPEG", "Other"],
      pluses: 75,
      doi: "10.3792.1234",
      url: "https://foundry-ml.org/#/datasets",
    },
    {
      title: "Crystal Dataset Four",
      size: "5 GB",
      number: "48",
      type: ["CSV", "JPEG", "Other"],
      pluses: 75,
      doi: "10.3792.1234",
      url: "https://foundry-ml.org/#/datasets",
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

  const scrollToBottom = () => {
    bottom?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    top?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="h-full w-full flex flex-col gap-12 px-4 sm:px-16 lg:px-36 pt-24 pb-2 font-display">
        {/* Place breadcrumbs here */}

        {/* Pipeline Header */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-8">
            <h1 className="text-3xl font-display">{fakeData.name}</h1>
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
              <button title="Pin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.5}
                  stroke="gray"
                  className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer"
                >
                  <path d="m16.114 1.553 6.333 6.333a1.75 1.75 0 0 1-.603 2.869l-1.63.633a5.67 5.67 0 0 0-3.395 3.725l-1.131 3.959a1.75 1.75 0 0 1-2.92.757L9 16.061l-5.595 5.594a.749.749 0 1 1-1.06-1.06L7.939 15l-3.768-3.768a1.75 1.75 0 0 1 .757-2.92l3.959-1.131a5.666 5.666 0 0 0 3.725-3.395l.633-1.63a1.75 1.75 0 0 1 2.869-.603ZM5.232 10.171l8.597 8.597a.25.25 0 0 0 .417-.108l1.131-3.959A7.17 7.17 0 0 1 19.67 9.99l1.63-.634a.25.25 0 0 0 .086-.409l-6.333-6.333a.25.25 0 0 0-.409.086l-.634 1.63a7.17 7.17 0 0 1-4.711 4.293L5.34 9.754a.25.25 0 0 0-.108.417Z"></path>
                </svg>
              </button>
              <button title="Cite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="gray"
                  viewBox="0 0 448 512"
                  className="w-6 h-6 text-gray-700 hover:text-gray-500 hover:cursor-pointer"
                >
                  <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z" />
                </svg>
              </button>
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
          <div className="flex gap-4">
            <div className="flex gap-2 items-center" title="Total Citations">
              <p className="text-lg">150 </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="green"
                viewBox="0 0 448 512"
                className="w-6 h-6 text-gray-700"
              >
                <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z" />
              </svg>
              <span>|</span>
            </div>

            <div className="flex gap-2 items-center" title="Total Pins">
              <p className="text-lg">150 </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="green"
                strokeWidth={1.5}
                className="w-6 h-6"
              >
                <path d="m16.114 1.553 6.333 6.333a1.75 1.75 0 0 1-.603 2.869l-1.63.633a5.67 5.67 0 0 0-3.395 3.725l-1.131 3.959a1.75 1.75 0 0 1-2.92.757L9 16.061l-5.595 5.594a.749.749 0 1 1-1.06-1.06L7.939 15l-3.768-3.768a1.75 1.75 0 0 1 .757-2.92l3.959-1.131a5.666 5.666 0 0 0 3.725-3.395l.633-1.63a1.75 1.75 0 0 1 2.869-.603ZM5.232 10.171l8.597 8.597a.25.25 0 0 0 .417-.108l1.131-3.959A7.17 7.17 0 0 1 19.67 9.99l1.63-.634a.25.25 0 0 0 .086-.409l-6.333-6.333a.25.25 0 0 0-.409.086l-.634 1.63a7.17 7.17 0 0 1-4.711 4.293L5.34 9.754a.25.25 0 0 0-.108.417Z"></path>
              </svg>
              <span>|</span>
            </div>
            <div className="flex gap-2 items-center" title="Total Shares">
              <p>175</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span>|</span>
            </div>
            <div className="flex gap-2 items-center" title="Total Runs">
              <p>400</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </div>
          </div>
          <div className="sm:flex pt-4 mr-8 text-lg">
            <p className="font-semibold pr-2">Contributors:</p>
            <p className={pClass} ref={widthRef}>
              {fakeData.authors
                .map<React.ReactNode>((author) => {
                  return <span>{author}</span>;
                })
                .reduce((prev, curr) => [prev, ", ", curr])}
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

        {/* Pipeline Overview */}
        {/* <div className="border-0 rounded-lg bg-gray-100 flex flex-col gap-5 p-4 text-sm text-gray-700">
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
        </div> */}

        <div className="pl-4">
          <p className=" border-b border-gray-300 text-2xl">
            &#128064; At a glance
          </p>
          <p className="p-4">{fakeData.description}</p>
        </div>

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

        <AccordionTop />
        {/* Run Pipeline */}
        {/* <div className="flex flex-col gap-8">
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
        </div> */}

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
            {/* Accordion steps tab */}
            {/* {active === "" && (
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
            )} */}

            {/* Side panel steps tab */}
            {active === "" && (
              <div className="grid grid-cols-5 h-[650px]">
                <div
                  className=" col-span-2 lg:col-span-1 bg-gray overflow-y-scroll"
                  ref={div}
                >
                  {/* <button className="absolute rounded-2xl bg-green bg-opacity-50 p-1 hover:bg-opacity-100">
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
                  </button> */}
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
                  {fakeData.steps.map((step, index) => {
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
                <div className=" col-span-3 lg:col-span-4 border border-2 border-gray p-8">
                  <h1 className="text-xl lg:text-3xl">
                    {fakeData.steps[buttonIndex].title}
                  </h1>
                  <p className="pt-8 text-md lg:text-xl">
                    {fakeData.steps[buttonIndex].description}
                  </p>
                </div>
              </div>
            )}
            {active === "Steps" && (
              <div className="grid grid-cols-5 h-[650px]">
                <div
                  className=" col-span-2 lg:col-span-1 bg-gray overflow-y-scroll"
                  ref={div}
                >
                  {/* <button className="absolute rounded-2xl bg-green bg-opacity-50 p-1 hover:bg-opacity-100">
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
                  </button> */}
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
                  {fakeData.steps.map((step, index) => {
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
                <div className=" col-span-3 lg:col-span-4 border border-2 border-gray p-8">
                  <h1 className="text-xl lg:text-3xl">
                    {fakeData.steps[buttonIndex].title}
                  </h1>
                  <p className="pt-8 text-md lg:text-xl">
                    {fakeData.steps[buttonIndex].description}
                  </p>
                </div>
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
                <div>
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

                <div>
                  <h1 className="underline text-2xl py-8">
                    Datasets used in this pipeline
                  </h1>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 sm:gap-12 lg:px-24">
                    {fakeDatasets.map((dataset) => {
                      return <DatasetBoxPipeline dataset={dataset} />;
                      
                    })}
                  </div>
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
