import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GardenBox from "../components/GardenBox";
import { GARDEN_INDEX_URL, SEARCH_SCOPE } from "../constants";
import { fetchWithScope } from "../globusHelpers";

const HomePage = () => {
  const [result, setResult] = useState<Array<any>>([]);

  useEffect(() => {
    async function Search() {
      try {
        const response = await fetchWithScope(
          SEARCH_SCOPE,
          GARDEN_INDEX_URL + "/search?q=2023&limit=6"
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
  }, []);


  // <div className="font-display flex flex-col items-center pt-5 sm:pt-10 px-5">
  //       <p className="pt-8 sm:pt-16 text-lg sm:text-2xl text-center max-w-sm">
  //         An ecosystem of ML models and datasets ready to be explored
  //       </p>
  //       <Link
  //         to="/search"
  //         className="mt-12 bg-green w-40 h-[48px] rounded-xl text-white text-center flex justify-center items-center hover:saturate-150"
  //       >
  //         Search
  //       </Link>
  //       <hr className="mt-10 w-11/12 bg-black" />
  //     </div>

  return (
    <>
      <div className="flex flex-row mx-10 mt-16">
        <div className="flex flex-col font-display pt-5 sm:pt-10 px-5 grow mt-8">
          <p className="font-semibold text-3xl sm:text-5xl max-w-3xl min-w-[50%]">
            Build a garden where your model can thrive
          </p>
          <p className="pt-14 font-normal text-xl sm:text-2xl max-w-3xl grow">
            Garden is an ecosystem of machine learning models and datasets—made by researchers to simplify ML.
          </p>
          <div className="font-display pt-5 sm:pt-10 px-5">
            <Link
              to="/search"
              className="mt-12 bg-green w-32 h-[48px] rounded-xl text-white text-center flex justify-center items-center hover:saturate-150"
            >
              Search
            </Link>
          </div>
        </div>

        <img
          src="img/AIGeneratedImg.png"
          alt="Garden AI Logo"
          className="w-[14rem] sm:w-[18rem] md:w-[24rem] lg:w-[28rem] object-scale-down"
        ></img>

      </div>

      <div className="font-display flex flex-col items-center pt-5 sm:pt-10 px-5">
        <hr className="mt-10 w-11/12 bg-black" />
      </div>

      <div
        id="icons-text"
        className="grid grid-cols-3 place-items-top gap-4 pt-14 px-[10%] font-display text-sm sm:text-xl "
      >
        {/* chart */}
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#53A86C"
            className="w-[6rem] h-[6rem] sm:w-[7rem] sm:h-[7rem]"
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
            className="w-[6rem] h-[6rem] sm:w-[7rem] sm:h-[7rem]"
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
            className="w-[6rem] h-[6rem] sm:w-[7rem] sm:h-[7rem]"
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
      <div className="font-display px-5 sm:px-20 py-8 mt-8 text-black">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold pb-10">
          We overcome barriers surrounding ML.
        </h1>
        <p className="text-md sm:text-lg">
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
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold pb-10">
          What are Gardens?
        </h1>
        <p className="text-md sm:text-lg">
          Gardens contain a full ML ecosystem. Models, data, tests, and
          benchmarks are all linked together and are required to meet FAIR
          principles to ensure accessibility and reproducibility. Gardens allow
          you engage with a broader audience by making publication of models
          quick and easy. This is efficiently achieved through sub-sections of a
          garden called “pipelines”.
        </p>
      </div>

      {/* Third section (Pipelines...) */}
      <div className="font-display px-5 sm:px-20 py-8 mt-8 text-black">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold pb-10">Pipelines</h1>
        <p className="text-md sm:text-lg">
          Pipelines are pages within a garden where all the relevant models and
          its associated materials are stored. Each pipeline is composed of
          steps such as input, function, output, etc. If a particular model is
          relevant in more than one garden, then that pipeline can be reused and
          displayed across them all, as they are not garden specific. Pipelines
          play a key role in the accessibility and reproducibility of a garden
          page.
        </p>
      </div>

      <div className="font-display flex flex-col items-center pt-5 sm:pt-10 px-5">
        <hr className="mt-5 w-11/12 bg-black" />
      </div>

      {/* Featured Gardens */}
      <div className="font-display py-8 px-5 sm:px-20 ">
        <h1 className="text-left text-xl sm:text-3xl lg:text-4xl font-semibold pb-10">
          Explore Featured Gardens
        </h1>
        <p className="text-md sm:text-lg">
          Take a look at some popular gardens that have been getting a lot of
          attention! You can view the models, datasets, papers, and anything
          else associated with the garden. Additionally, you can run the models
          to optimize your own workflow, gain inspiration, or for any other
          reason you see fit.
        </p>

        <div
          id="Garden-Squares"
          className="flex flex-row overflow-auto min-h-min gap-6 p-2 pt-8"
        >
          {result.map((res) => (
            <GardenBox garden={res} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center pt-5 sm:pt-10 px-5">
        <hr className="mt-5 w-11/12 bg-black" />
      </div>

      {/* Bottom section/credits */}
      <div className="flex columns-2 font-display text-black mx-20 my-10">

        <div className="flex flex-col">
          <img
            src="img/smallColorIcon_Garden.png"
            alt="Garden AI Logo"
            className="max-w-[150px] object-contain mb-6">
          </img>
          <div><Link to="/terms">Terms & Policies</Link></div>
          <div>Brand guidelines</div>
          <div>Team</div>
        </div>

        <div className="py-10 flex-auto">
        </div>

        <div className="py-10 ml-10">
          <p className="text-sm pt-8">
            This project was made possible by:
          </p>
          <div className="grid grid-rows-4 grid-flow-col gap-2 items-center">

            <section className="">
              <h1 className="font-bold text-sm pt-2">
                MDF
              </h1>
              <p className="text-xs max-w-sm">
                Data services to help material scientists publish and discover
                data
              </p>
            </section>

            <section className="">
              <h1 className="font-bold text-sm pt-2">
                National Science Foundation
              </h1>
              <p className="text-xs max-w-sm">
                Award Abstract #2209892: “Frameworks: Garden: A FAIR Framework for
                Publishing and Applying AI Models for Translational Research in
                Science, Engineering, Education, and Industry”
              </p>
            </section>

            <section className="">
              <h1 className="font-bold text-sm pt-2">
                Foundry
              </h1>
              <p className="text-xs max-w-sm">
                An open source machine learning platform for scientists
              </p>
            </section>

            <section className="">
              <h1 className="font-bold text-sm pt-2">
                Globus
              </h1>
              <p className="text-xs max-w-sm">
                Research cyberinfrastructure, developed and operated as a
                not-for-profit service by the University of Chicago
              </p>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://materialsdatafacility.org/">
                <img
                  src="img/MDF-logo.png"
                  alt="MDF logo"
                  className="max-w-[150px] hover:opacity-75"
                />
              </a>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://www.nsf.gov/">
                <img
                  src="img/National-Science-Foundation-logo.jpeg"
                  className="max-w-[60px] hover:opacity-75"
                  alt="NSF logo"
                />
              </a>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://foundry-ml.org/#/">
                <img
                  src="img/foundry-logo.png"
                  alt="Foundry logo"
                  className="max-w-[150px] hover:opacity-75"
                />
              </a>
            </section>

            <section className="place-self-center">
              <a target="blank" href="https://www.globus.org/">
                <img
                  src="img/globus-logo.png"
                  alt="Gloubs logo"
                  className="max-w-[100px] hover:opacity-75"
                />
              </a>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
