import React from "react";

const HomePage = () => {
  return (
    <>
      <div className="container-max-w-full bg-gray-200 shadow border p-6">
        HomePage
      </div>
      <div className="font-display flex flex-col items-center pt-5 sm:pt-10 px-5 ">
        <p className="font-semibold text-3xl sm:text-6xl text-center max-w-3xl">
          Build a garden where your model can thrive
        </p>
        <p className="pt-8 sm:pt-16 text-lg sm:text-3xl text-center max-w-lg">
          An ecosystem of ML models and datasets ready to be explored
        </p>
        <button className="mt-12 bg-green w-48 h-[64px] rounded-xl text-white">
          Search
        </button>
      </div>

      <div
        id="icons-text"
        className="grid grid-cols-3 place-items-top gap-4 pt-14 px-[10%] font-display text-sm sm:text-2xl "
      >
        {/* chart */}
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#53A86C"
            className="w-[6rem] h-[6rem] sm:w-[10rem] sm:h-[10rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>
          <p className="text-center max-w-[15rem]">
            Boost the visibility of your work
          </p>
        </div>

        {/* Magnifying glass */}
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#53A86C"
            className="w-[6rem] h-[6rem] sm:w-[10rem] sm:h-[10rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="text-center max-w-[15rem]">
            Search for models and data specific to your research
          </p>
        </div>

        {/* Lightbulb */}
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#53A86C"
            className="w-[6rem] h-[6rem] sm:w-[10rem] sm:h-[10rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          <p className="text-center max-w-[15rem]">
            Find solutions to similar problems
          </p>
        </div>
      </div>

      {/* First section (We overcome...) */}
      <div className="bg-green font-display px-5 sm:px-20 py-8 mt-8 text-white">
        <h1 className="text-xl sm:text-4xl font-semibold pb-10">
          We overcome barriers surrounding ML
        </h1>
        <p className="text-md sm:text-xl">
          We seek to create collections of ML models that are linked with the
          data and computing resources required to advance the work of research
          communities. These gardens make it easy to publish models that can be
          integrated into academia and industry alike. Researchers can provide
          broad access to their models, without having to worry about the
          difficulties surrounding discovery, access, and deployment.
        </p>
      </div>

      {/* Second Section (What are...) */}
      <div className="font-display px-5 sm:px-20 py-8">
        <h1 className="text-xl sm:text-4xl text-right font-semibold pb-10">
          What are Gardens?
        </h1>
        <p className="text-md sm:text-xl">
          Gardens contain a full ML ecosystem. Models, data, tests, and
          benchmarks are all linked together and are required to meet FAIR
          principles to ensure accessibility and reproducibility. Gardens allow
          you engage with a broader audience by making publication of models
          quick and easy. This is efficiently achieved through sub-sections of a
          garden called “pipelines”.
        </p>
      </div>

      {/* Third section (Pipelines...) */}
      <div className="bg-green font-display px-5 sm:px-20 py-8 mt-8 text-white">
        <h1 className="text-xl sm:text-4xl font-semibold pb-10">Pipelines</h1>
        <p className="text-md sm:text-xl">
          Pipelines are pages within a garden where all the relevant models and
          its associated materials are stored. Each pipeline is composed of
          steps such as input, function, output, etc. If a particular model is
          relevant in more than one garden, then that pipeline can be reused and
          displayed across them all, as they are not garden specific. Pipelines
          play a key role in the accessibility and reproducibility of a garden
          page.
        </p>
      </div>
    </>
  );
};

export default HomePage;
