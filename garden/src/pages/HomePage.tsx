import { Link } from "react-router-dom";
import GardenBox from "../components/GardenBox";
import { useSearchGardens } from "../api/search";
import { Garden } from "../types";

const HomePage = () => {
  const { data: gardens } = useSearchGardens("*", "6");

  return (
    <>
      <div className="mx-auto -mt-10 flex w-11/12 grow flex-col items-center p-8 font-display md:grid md:grid-cols-2 md:gap-4 md:pt-10">
        <p className="title -mb-28 -mt-10 min-w-[50%] max-w-3xl text-3xl font-semibold md:text-5xl">
          Build a garden where your model can thrive.
        </p>
        <img
          src="img/AIGeneratedImg.png"
          alt="Garden AI Logo"
          className="w-[24rem] justify-self-center md:row-span-2 lg:w-[28rem]"
        ></img>
        <p className="-mt-12 max-w-3xl pt-4 text-xl font-normal sm:text-2xl">
          Garden is an ecosystem of machine learning models and datasets—made by
          researchers to simplify ML.
        </p>
      </div>

      <div className="-mt-15 flex justify-center px-5 pt-5 font-display sm:pt-10">
        <Link
          to="/search"
          className="flex h-[48px] w-32 items-center justify-center rounded-xl bg-green text-white hover:saturate-150"
        >
          Search
        </Link>
      </div>

      <div className="flex flex-col items-center px-5 pt-5 font-display sm:pt-10">
        <hr className="mt-10 w-11/12 bg-black" />
      </div>

      <div
        id="icons-text"
        className="place-items-top grid grid-cols-3 gap-4 px-[10%] pt-14 font-display text-sm sm:text-xl "
      >
        {/* chart */}
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#53A86C"
            className="h-[6rem] w-[6rem] sm:h-[7rem] sm:w-[7rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>
          <p className="max-w-[15rem] text-center">
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
            className="h-[6rem] w-[6rem] sm:h-[7rem] sm:w-[7rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="max-w-[15rem] text-center">
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
            className="h-[6rem] w-[6rem] sm:h-[7rem] sm:w-[7rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          <p className="max-w-[15rem] text-center">
            Find solutions to similar problems
          </p>
        </div>
      </div>

      <div className="px-5 py-8 font-display text-black sm:px-12 md:px-20">
        {/* First section (We overcome...) */}
        <div className="middle-text-section mt-14">
          <h1 className="pb-8 text-xl font-semibold sm:text-3xl lg:text-4xl">
            We overcome barriers surrounding ML.
          </h1>
          <p className="text-md sm:text-lg">
            We seek to create collections of ML models that are linked with the
            data and computing resources required to advance the work of
            research communities. These gardens make it easy to publish models
            that can be integrated into academia and industry alike. Researchers
            can provide broad access to their models, without having to worry
            about the difficulties surrounding discovery, access, and
            deployment.
          </p>
        </div>

        {/* Second Section (What are...) */}
        <div className="mt-14">
          <h1 className="pb-8 text-xl font-semibold sm:text-3xl lg:text-4xl">
            What are Gardens?
          </h1>
          <p className="text-md sm:text-lg">
            Gardens contain a full ML ecosystem. Models, data, tests, and
            benchmarks are all linked together and are required to meet FAIR
            principles to ensure accessibility and reproducibility. Gardens
            allow you engage with a broader audience by making publication of
            models quick and easy. This is efficiently achieved through
            sub-sections of a garden called “entrypoints”.
          </p>
        </div>

        {/* Third section (Entrypoints...) */}
        <div className="mt-14">
          <h1 className="pb-8 text-xl font-semibold sm:text-3xl lg:text-4xl">
            Entrypoints
          </h1>
          <p className="text-md entrypoints sm:text-lg">
            Entrypoints are pages within a garden where all the relevant models
            and its associated materials are stored. Each entrypoint is composed
            of steps such as input, function, output, etc. If a particular model
            is relevant in more than one garden, then that entrypoint can be
            reused and displayed across them all, as they are not garden
            specific. Entrypoints play a key role in the accessibility and
            reproducibility of a garden page.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center px-5 pt-5 font-display sm:pt-10">
        <hr className="mt-5 w-11/12 bg-black" />
      </div>

      <div className="px-5 py-8 font-display sm:px-12 md:px-20">
        {/* Featured Gardens */}
        <h1 className="pb-10 text-left text-xl font-semibold sm:text-3xl lg:text-4xl">
          <div className="flex flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="ml-0 mr-4 h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
              />
            </svg>
            Explore Featured Gardens
          </div>
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
          className="flex min-h-min flex-row gap-6 overflow-auto p-2 pt-8"
        >
          {gardens?.map((garden: Garden) => (
            <GardenBox garden={garden} key={garden.doi} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
