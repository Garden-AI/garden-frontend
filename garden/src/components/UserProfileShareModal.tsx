import React from "react";

const UserProfileShareModal = (props: {
  show: boolean;
  close: Function;
  copy: Function;
  showTooltip: Function;
}) => {
  if (!props.show) {
    return <div></div>;
  };

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70 font-display">
      <div className="min-h-[40vh] w-[75vw] bg-white sm:w-[50vw]">
        <button className="float-right mr-4 mt-2" onClick={() => props.close()}>
          <span className="px-4 py-4 text-lg font-bold">X</span>
        </button>
        <p className="pl-12 pt-16 text-3xl font-medium"> Share </p>
        <div className="flex items-center justify-evenly pt-10">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="img/facebook-logo.png"
              alt="Facebook logo"
              className="max-w-[5vw] sm:max-w-[3vw]"
            />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="img/twitter-logo.png"
              alt="Twitter logo"
              className="max-w-[5vw] sm:max-w-[3vw]"
            />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="img/LinkedIn-logo.png"
              alt="LinkedIn logo"
              className="max-w-[5vw] sm:max-w-[3vw]"
            />
          </a>
          <a
            href="https://www.reddit.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="img/reddit-logo.png"
              alt="Reddit logo"
              className="max-w-[5vw] sm:max-w-[3vw]"
            />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="img/github-logo.png"
              alt="Github logo"
              className="max-w-[5vw] sm:max-w-[3vw]"
            />
          </a>
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="img/discord-logo.png"
              alt="Discord logo"
              className="max-w-[5vw] sm:max-w-[3vw]"
            />
          </a>
        </div>
        <p className="pl-12 pt-12">Copy Link</p>
        <div className="flex items-center">
          <div className="ml-4 mt-2 overflow-auto whitespace-nowrap border-2 border-solid border-gray-100 sm:ml-14 sm:w-[30vw]">
            <span className="px-4 text-sm">{window.location.href}</span>
          </div>
          <button onClick={() => props.copy()} className="ml-2 mt-1">
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
      </div>
    </div>
  );
};

export default UserProfileShareModal;
