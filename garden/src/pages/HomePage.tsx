import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import GardenBox from "../components/GardenBox";
import { GARDEN_INDEX_URL, SEARCH_SCOPE } from "../constants";
import { fetchWithScope } from "../globusHelpers";

const HomePage = () => {
  const [result, setResult] = useState<Array<any>>([])

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
        setResult(content.gmeta);
      } catch (error) {
        setResult([]);
      }
    }
    Search()
    
  }, []);
  console.log('result', result)

  return (
    <>
      {/* <div className="container-max-w-full bg-gray-200 shadow border p-6">
        HomePage
      </div> */}
      <Navbar />
      <div className="font-display flex flex-col items-center pt-5 sm:pt-10 px-5">
        <p className="font-semibold text-3xl sm:text-6xl text-center max-w-3xl">
          Build a garden where your model can thrive
        </p>
        <p className="pt-8 sm:pt-16 text-lg sm:text-3xl text-center max-w-lg">
          An ecosystem of ML models and datasets ready to be explored
        </p>
        <Link
          to="/search"
          className="mt-12 bg-green w-48 h-[64px] rounded-xl text-white text-center flex justify-center items-center hover:saturate-150"
        >
          Search
        </Link>
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

      {/* Featured Gardens */}
      <div className="font-display py-8 px-5 sm:px-20">
        <h1 className="text-center text-xl sm:text-4xl font-semibold underline underline-offset-4 decoration-green decoration-4 pb-10">
          Featured Gardens
        </h1>
        <p className="text-md sm:text-xl">
          Take a look at some popular gardens that have been getting a lot of
          attention! You can view the models, datasets, papers, and anything
          else associated with the garden. Additionally, you can run the models
          to optimize your own workflow, gain inspiration, or for any other
          reason you see fit.
        </p>

        <div
          id="Garden-Squares"
          className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-8"
        >
          {result.map((res) => 
            <GardenBox garden={res}/>
          )}
          {/* <GardenBox garden={}/>
          <GardenBox />
          <GardenBox />
          <GardenBox />
          <GardenBox />
          <GardenBox /> */}
        </div>
      </div>

      {/* Bottom section/credits */}
      <div className="font-display bg-green pb-8">
        <p className="text-white text-lg sm:text-xl pt-8 text-center">
          This project was made possible by:
        </p>
        <div className="bg-white my-8 mx-6 sm:mx-16 md:mx-16 rounded-xl flex flex-wrap items-center justify-evenly py-10">
          <section className="flex flex-col items-center">
            <a target="blank" href="https://materialsdatafacility.org/">
              <img
                src="img/MDF-logo.png"
                alt="MDF logo"
                className="max-w-[200px] hover:opacity-75"
              />
            </a>
            <h1 className="font-bold text-md md:text-xl pt-6 text-center">
              MDF
            </h1>
            <p className="text-center text-sm md:text-lg mx-1 md:mx-5 pt-2 pb-8 md:pt-4 max-w-xs">
              Data services to help material scientists publish and discover
              data
            </p>
          </section>

          <section className="flex flex-col items-center">
            <a target="blank" href="https://www.nsf.gov/">
              <img
                src="img/National-Science-Foundation-logo.jpeg"
                className="max-w-[70px] hover:opacity-75"
                alt="NSF logo"
              />
            </a>
            <h1 className="font-bold text-md md:text-xl pt-6 text-center">
              National Science Foundation
            </h1>
            <p className="text-center mx-1 md:mx-5 pt-4 max-w-xs text-sm pb-8">
              Award Abstract #2209892: “Frameworks: Garden: A FAIR Framework for
              Publishing and Applying AI Models for Translational Research in
              Science, Engineering, Education, and Industry”
            </p>
          </section>

          <section className="flex flex-col items-center">
            <a target="blank" href="https://foundry-ml.org/#/">
              <img
                src="img/foundry-logo.png"
                alt="Foundry logo"
                className="max-w-[200px] hover:opacity-75"
              />
            </a>
            <h1 className="font-bold text-md md:text-xl pt-6 text-center">
              Foundry
            </h1>
            <p className="text-center text-sm md:text-lg mx-5 pt-4 max-w-xs">
              An open source machine learning platform for scientists
            </p>
          </section>

          <section className="flex flex-col items-center">
            <a target="blank" href="https://www.globus.org/">
              <img
                src="img/globus-logo.png"
                alt="Gloubs logo"
                className="max-w-[200px] hover:opacity-75"
              />
            </a>
            <h1 className="font-bold text-md md:text-xl pt-6 text-center">
              Globus
            </h1>
            <p className="text-center text-sm md:text-lg mx-5 pt-4 max-w-xs">
            Research cyberinfrastructure, developed and operated as a not-for-profit service by the University of Chicago
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
