import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PipelineBox from "../components/PipelineBox";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import RelatedGardenBox from "../components/RelatedGardenBox";
// import Breadcrumbs from "../components/Breadcrumbs";
import CommentBox from "../components/CommentBox";

const GardenPage = () => {
  const { uuid } = useParams();
  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);
  const [showComment, setShowComment] = useState(true);
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
  const fakeDatasetOne = {
    type: "dataset",
    doi: "10.3792.1234",
    repository: "Foundry",
    url: "https://foundry-ml.org/#/datasets",
  };
  const fakeDatasetTwo = {
    type: "dataset",
    doi: "10.3792.1234",
    repository: "Zenodo",
    url: "https://zenodo.org/",
  };
  const fakeComments = [
    {
      user: "Chase Jenkins",
      type: "Comment",
      title: "This is a great garden",
      body: "I love this garden! It's very well done, and I was able to take a look at the models and was very impressed with what I saw. I am definilty going to have to share this with some friends and colleagues.   lskdfj kdf kjfdlksdlk jsj lkslj kfsd jdsflkjsfdj sjlk fsdlk jfsklj fkljs fsdjklfsl dkjfjsk lfkjsljkf sjklfsdljkfdslkjfsdkljfsdl kjfsd fds jfdslk jfkl fds jfsd kljfsdlk jfsdlk jfdskl jfdsljk  kljdsflkj dsf klfdsklj dfjkldfsljk fdsjkl fdskjlfdsjkl dfsljk fdsljk dfsljk fdsljkdfskjfdjkl fdsklj fsdkljfdsklj fdsjkl fdsljfdsljk dsfljkfdsljkfdsljkfdsjlkfdsljk fdjlkfdsljk dfslkj ",
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
          user: "Chase Four",
          body: "You are so right",
        },
        {
          user: "Chase Four",
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
    alert("Text copied");
  };

  const showModal = () => {
    setShow(true);
    console.log(window.location.search);
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

  const commentFilter = () => {
    return fakeComments.filter((comment)=> comment.type === "Comment").map((comment) => (
      <CommentBox key={comment.body} comment={comment} />
    ));
  };

  const questionFilter = () => {
    return fakeComments.filter((comment)=> comment.type === "Question").map((comment) => (
      <CommentBox key={comment.body} comment={comment} />
    ));
  };

  return (
    <div className="font-display">
      <Navbar />
      <div className="h-full w-full flex flex-col gap-10 sm:px-16 md:px-36 py-20 font-display">
        {/* Place breadcrumbs here */}
        {/* <Breadcrumbs /> */}
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
            <Modal
              show={show}
              close={closeModal}
              copy={copy}
              doi={fakeData.doi}
            />
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
            {active === "Discussion" && (
              <div className="mx-16">
                <div className="flex pb-6 gap-6">
                  <button
                    className={showComment === true ? " bg-green text-white border border-1 border-white w-max px-3 rounded-2xl":"border border-1 border-black w-max px-3 rounded-2xl"}
                    onClick={() => setShowComment(true)}
                  >
                    <p>Comments</p>
                  </button>
                  <button
                    className={showComment === false ? " bg-green text-white border border-1 border-white w-max px-3 rounded-2xl":"border border-1 border-black w-max px-3 rounded-2xl"}
                    onClick={() => setShowComment(false)}
                  >
                    <p>Questions</p>
                  </button>
                </div>
                {/* {fakeComments.map((comment) => (
                  <CommentBox key={comment.body} comment={comment} />
                ))} */}
                {showComment === true ? commentFilter() : questionFilter()}
              </div>
            )}
            {active === "Datasets" && (
              <div>
                <div className="pb-8">
                  <p className="mx-16 pt-8 pb-2 text-xl">
                    Find the dataset here:{" "}
                    <a target="blank" href={fakeDatasetOne.url}>
                      {fakeDatasetOne.url}
                    </a>
                  </p>
                  <p className="mx-16 px-4 text-lg">
                    -DOI: {fakeDatasetOne.doi}
                  </p>
                </div>
                {fakeDatasetOne.repository === "Foundry" ? (
                  <div>
                    <p className="mx-16 text-xl pb-4">
                      This dataset uses Foundry, here is how you can view it:
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
                        <span className="text-green">
                          '{fakeDatasetOne.doi}'
                        </span>
                        , globus=<span className="text-orange">False</span>)
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

        {/* Pipelines Gallery */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fakeData.pipelines.map((pipeline) => (
            <PipelineBox key={pipeline} doi={pipeline} />
          ))}
        </div> */}
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
          <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox />
          <RelatedGardenBox />
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
