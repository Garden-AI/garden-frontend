import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";

import { Garden } from "@/types";

import SyntaxHighlighter from "@/components/SyntaxHighlighter";

import { Separator } from "@/components/shadcn/separator";
import GardenBox from "@/features/gardens/components/GardenBox";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";
import {
  SquareStack,
  LockKeyholeOpen,
  ShieldCheck,
  PersonStanding,
  MoveRight,
  Rocket,
  Share2Icon,
  Lightbulb,
  Search,
} from "lucide-react";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import UChicagoLogo from "@/svgs/logos/uchicago"
import NSFLogo from "@/svgs/logos/nsf"
import WisconsinLogo from "@/svgs/logos/badger"
import ArgonneLogo from "@/svgs/logos/argonne"
import DOELogo from "@/svgs/logos/doe"
import MITLogo from "@/svgs/logos/beaver"

const icons = [
  { icon: Share2Icon, text: "Boost the visibility of your work" },
  {
    icon: Search,
    text: "Search for models specific to your research",
  },
  { icon: Lightbulb, text: "Find solutions to similar problems" },
];

const HomePage = () => {
  const auth = useGlobusAuth();
  useEffect(() => {
    async function getToken() {
      await auth.authorization?.handleCodeRedirect();
    }
    getToken();
  }, [auth]);

  const gardens: Garden[] = [
    {
      title: "Garden of assorted materials properties",
      description:
        "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
      doi: "10.26311/ep98-br79",
      publisher: "Ryan Jacobs",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      is_test: false,
    },
    {
      title: "Atom segmentation deep learning models",
      description:
        "A collection of models that identify atomic column coordinates in scanning transmission electron microscopy (STEM) images.",
      doi: "10.26311/naqk-9p91",
      publisher: "Will Engler",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      is_test: false,
    },
    {
      title: "Transmission electron microscopy (TEM) video analysis models",
      description:
        "This garden just hosts the DefectTrack model for now, and may host other TEM video processing models in the future.",
      doi: "10.26311/frce-y203",
      publisher: "Will Engler",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      is_test: false,
    },
    {
      title: "Models for processing position-averaged convergent beam electron diffraction images",
      description:
        "This garden just hosts the PACBED-CNN model for now, and may host other position-averaged convergent beam electron diffraction models in the future.",
      doi: "10.26311/hqgg-7m42",
      publisher: "Will Engler",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      is_test: false,
    },
    {
      title: "Semiconductor property prediction models",
      description: "A collection of models for predicting properties of semiconductors",
      doi: "10.26311/bg7s-v305",
      publisher: "Will Engler",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      is_test: false,
    },
    {
      title: "Materials Screening Performance Tests",
      description: "Figuring out how to run millions of materials property predictions quickly",
      doi: "10.23677/m4ek-bd27",
      publisher: "Will Engler",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      is_test: false,
    },
    {
      title: "Framework example garden",
      description:
        "This garden contains entrypoints showing how to use different popular AI frameworks in Garden",
      doi: "10.26311/b74a-5c58",
      publisher: "Will Engler",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      is_test: false,
    },
  ];

  return (
    <div className="font-display">
      <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 py-36">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-6xl">
            Publish, Share, and Run ML Models with <span className="text-brightgreen">Garden</span>
          </h1>
          <p className="mx-auto mb-8 mt-8 max-w-2xl text-xl text-gray-600">
            Empower your research with easy-to-use machine learning models for science applications
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/search">
              <button className="rounded-full bg-green px-8 py-3 text-lg font-semibold text-white transition-transform hover:scale-105">
                Explore Models
              </button>
            </Link>
            <Link to="/garden/create">
              <button className="rounded-full border-2 border-green bg-white px-8 py-3 text-lg font-semibold text-green transition-transform hover:scale-105">
                Start Your Garden
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="items-center bg-gray-700 px-2 py-2">
        <div className="mx-auto text-center sm:px-8 md:max-w-screen-md md:px-20 lg:max-w-screen-xl lg:px-12">
          <div className="mt-1 flex flex-wrap items-center justify-center text-gray-400 sm:justify-between">
            <a
              href="https://www.uchicago.edu/en"
              target="_blank"
              className="mr-5 hover:text-gray-200 dark:hover:text-gray-200"
            >
              <UChicagoLogo/>
            </a>

            <a
              href="https://www.nsf.gov/"
              target="_blank"
              className="mr-5 hover:text-gray-200 dark:hover:text-gray-400"
            >
              <NSFLogo/>
            </a>

            <a
              href="https://www.wisc.edu/"
              target="_blank"
              className="mr-5 hover:text-gray-200 dark:hover:text-gray-400"
            >
              <WisconsinLogo/>
            </a>

            <a
              href="https://www.anl.gov/"
              target="_blank"
              className="mr-5 pb-4 hover:text-gray-200 dark:hover:text-gray-400"
            >
              <ArgonneLogo/>
            </a>
            <a
              href="https://www.energy.gov/"
              target="_blank"
              className="mr-5 hover:text-gray-200 dark:hover:text-gray-400"
            >
              <DOELogo/>
            </a>

            <a
              href="https://www.mit.edu/"
              target="_blank"
              className="mr-5 w-24 pb-4 pt-3 hover:text-gray-200 dark:hover:text-gray-400"
            >
              <MITLogo/>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mt-12 px-4 ">
          <div className="flex items-baseline">
            <h1 className="text-3xl font-semibold">Start a garden</h1>
            <p className="ml-4 font-extrabold text-green">
              <Link to="/garden/create">
                <span className="group inline-flex items-center text-lg">
                  The Plot is yours
                  <MoveRight className="mx-2 h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1" />
                </span>
              </Link>
            </p>
          </div>
          <h2 className="mt-2 text-lg">
            Gardens are collections of ML models that are linked with data and computing resources
            to advance the work of research communities. These gardens make it easy to publish
            models which can be integrated into academia and industry alike. Researchers can provide
            broad access to their models, without having to worry about the difficulties surrounding
            discovery, access, and deployment.
          </h2>
        </div>
        <div className="mx-auto grid grid-cols-1 justify-around gap-x-12 gap-y-8 px-20 py-12 sm:grid-cols-3 ">
          {icons.map((icon, index) => (
            <div key={index} className="flex h-40 flex-col items-center text-center ">
              <div className="w-full">
                <icon.icon size={110} className="mx-auto w-full text-primary" />
              </div>
              <p className="text-center md:text-xl">{icon.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Separator />

      <div className="mx-auto mt-20 max-w-5xl px-4">
        <h2 className="text-3xl font-semibold">Get Started in Minutes</h2>
        <p className="mt-4 text-lg">
          You can publish your first garden within 15 minutes!
        </p>
        <div className="mx-auto max-w-6xl pt-4">
          <div className="flex flex-col items-center space-y-8 md:flex-row md:space-x-12 md:space-y-0">
            <div className="w-full text-sm md:w-1/2">
              <SyntaxHighlighter>
                {`from garden_ai import GardenClient

garden_client = GardenClient()
garden = garden_client.get_garden("10.26311/ep98-br79")

def predict_properties():
    materials = ['AgI', 'CdTe', 'BN']
    result = garden.predict_piezoelectric(materials)
    return result

# Run the model and get results
predictions = predict_properties()`}
              </SyntaxHighlighter>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="mb-4 text-2xl font-semibold">Easy Integration, Powerful Results</h3>
              <p className="mb-6 text-lg">
                With just a few lines of code, you can access and run sophisticated ML models.
                Garden handles the complexities, so you can focus on your research.
              </p>
              <a
                href="https://garden-ai.readthedocs.io/en/latest/"
                target="_blank"
              >
                <span className="group inline-flex items-center text-lg text-green">
                  Read the documentation
                  <MoveRight className="ml-2 h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mb-12 mt-20 max-w-5xl md:flex">
        <div className="mt-12 px-4 md:mt-8 md:w-5/12">
          <h1 className="text-3xl font-semibold">Research using ML doesn't have to be hard.</h1>
          <h2 className="mt-4 text-lg">
            We overcome the barriers surrounding ML, so that you can spend more time researching and
            less time setting up code to run models.
          </h2>
        </div>

        <div className="mx-auto mt-4 md:w-5/12">
          <Accordion type="single" collapsible className="mb-10 border-y" defaultValue="materials">
            <AccordionItem value="one">
              <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                <div className="flex items-center gap-x-2 p-2">
                  <SquareStack className="text-gray-500" />
                  <span className="font-medium text-gray-700">Reproducibility</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                <>
                  <div className="rounded-md border bg-white p-6">
                    <p className="text-base text-gray-800 ">
                      There's a lot of code that goes into reproducing an ML pipeline to get the
                      desired output. We make every garden easy to follow.{" "}
                    </p>
                  </div>
                </>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                <div className="flex items-center gap-x-2 p-2">
                  <LockKeyholeOpen className="text-gray-500" />
                  <span className="font-medium text-gray-700">Accessibility</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                <>
                  <div className="rounded-md border bg-white p-6">
                    <p className="text-base text-gray-800 ">
                      All code, data, testing is available and free without any barriers to access.
                      You can run models using our compute resources at UChicago or any Globus
                      Compute endpoint.{" "}
                    </p>
                  </div>
                </>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="three">
              <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                <div className="flex items-center gap-x-2 p-2">
                  <ShieldCheck className="text-gray-500" />
                  <span className="font-medium text-gray-700">Quality</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                <>
                  <div className="rounded-md border bg-white p-6">
                    <p className="text-base text-gray-800 ">
                      We test and evaluate models on our side, so you can browse research without
                      the time investment of doing all of that yourself.{" "}
                    </p>
                  </div>
                </>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="four">
              <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                <div className="flex items-center gap-x-2 p-2">
                  <PersonStanding className="text-gray-500" />
                  <span className="font-medium text-gray-700">Community</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                <>
                  <div className="rounded-md border bg-white p-6">
                    <p className="text-base text-gray-800 ">
                      Garden is a collaborative platform that connects like-minded people. Find your
                      ML community, collaborate, and set new benchmarks in your domain.{" "}
                    </p>
                  </div>
                </>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="bg-green pt-6">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-white">
            <h1 className="text-left text-3xl font-semibold">
              <div className="flex space-x-4">
                <Rocket size={35} className="my-auto" />
                <h3>Featured Gardens </h3>
              </div>
            </h1>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-4 p-4 ">
            {gardens?.map((res: any, index: any) => (
              <div className="h-[300px] w-[300px]" key={index}>
                <GardenBox garden={res} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default HomePage;
