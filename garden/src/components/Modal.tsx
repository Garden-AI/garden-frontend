import React from "react";

const Modal = (props: { show: boolean; close: Function; copy: Function; doi: string; showTooltip: Function }) => {
  if (!props.show) {
    return <div></div>;
  }

  const copyDOI = async () => {
    await navigator.clipboard.writeText(props.doi);
    props.showTooltip();
  };

  return (
    <div className="z-45 fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70 font-display">
      <div className="min-h-[50vh] w-[75vw] bg-white sm:w-[50vw]">
        <button className="float-right mr-4 mt-2" onClick={() => props.close()}>
          <span className="px-4 py-4 text-lg font-bold">X</span>
        </button>
        <p className="pl-12 pt-16 text-3xl font-medium"> Share </p>
        <div className="flex items-center justify-evenly pt-10">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <img src="img/facebook-logo.png" alt="Facebook logo" className="max-w-[5vw] sm:max-w-[3vw]" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <img src="img/twitter-logo.png" alt="Twitter logo" className="max-w-[5vw] sm:max-w-[3vw]" />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <img src="img/LinkedIn-logo.png" alt="LinkedIn logo" className="max-w-[5vw] sm:max-w-[3vw]" />
          </a>
          <a href="https://www.reddit.com/" target="_blank" rel="noopener noreferrer">
            <img src="img/reddit-logo.png" alt="Reddit logo" className="max-w-[5vw] sm:max-w-[3vw]" />
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <img src="img/github-logo.png" alt="Github logo" className="max-w-[5vw] sm:max-w-[3vw]" />
          </a>
          <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">
            <img src="img/discord-logo.png" alt="Discord logo" className="max-w-[5vw] sm:max-w-[3vw]" />
          </a>
        </div>
        <p className="pl-12 pt-12">Copy Link</p>
        <div className="flex items-center">
          <div className="ml-4 mt-2 overflow-auto whitespace-nowrap border-2 border-solid border-gray-100 sm:ml-14 sm:w-[30vw]">
            <span className="px-4 text-sm">{window.location.href}</span>
          </div>
          <button onClick={() => props.copy()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="black"
              className="mx-2 h-6 w-6 sm:ml-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </button>
        </div>

        <p className="pl-12 pt-6">Copy DOI</p>
        <div className="flex items-center pb-8">
          <div className="ml-4 mt-2 overflow-auto whitespace-nowrap border-2 border-solid border-gray-100 sm:ml-14 sm:w-[30vw]">
            <span className="px-4 text-sm">{props.doi}</span>
          </div>
          <button onClick={copyDOI}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="black"
              className="mx-2 h-6 w-6 sm:ml-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
