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
  Container,
  Cpu,
  Atom,
  GitBranch,
  Sprout,
} from "lucide-react";
import { useGlobusAuth } from "@globus/react-auth-context";
import UChicagoLogo from "@/svgs/logos/uchicago"
import NSFLogo from "@/svgs/logos/nsf"
import WisconsinLogo from "@/svgs/logos/badger"
import ArgonneLogo from "@/svgs/logos/argonne"
import DOELogo from "@/svgs/logos/doe"
import MITLogo from "@/svgs/logos/beaver"

const HomePage = () => {
  const auth = useGlobusAuth();
  const { isAuthenticated, authorization } = auth;
  useEffect(() => {
    async function getToken() {
      if (!authorization?.handleCodeRedirect || isAuthenticated) {
        return;
      }
      await authorization.handleCodeRedirect();
    }
    getToken();
  }, [authorization, authorization?.handleCodeRedirect, isAuthenticated]);

  const gardens: Garden[] = [
    {
      title: "FairChem/OpenCatalyst OC20 Models",
      description:
        "This Garden contains models trained on the OC20 dataset published by FairChem and the Open Catalyst Project. The models in this Garden are full-sized and trained on the full OC20 dataset. Both S2EF and IS2RE models ...",
      doi: "10.26311/65ez-ew73",
      publisher: "Hayden Holbrook",
      owner: "Hayden Holbrook",
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
      title: "Materials Property Prediction with MAST-ML",
      description:
        "Random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance. Models are trained and executed with the Materials Simulation Toolkit for Machine Learning (MAST-ML) from the UW-Madison Computational Materials Group. This garden also includes three batch execution variants used to screen candidate perovskites.",
      doi: "10.26311/ep98-br79",
      publisher: "Ryan Jacobs",
      owner: "Ryan Jacobs",
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
      title: "Conservative to Primitive Conversion in Relativistic Hydrodynamics",
      description:
        "This garden hosts a suite of PyTorch models (and corresponding TensorRT engines) trained for conservative-to-primitive variable recovery in numerical relativity simulations, specifically tailored ...",
      doi: "10.26311/hhwc-0v60",
      publisher: "Semih Kacmaz",
      owner: "Semih Kacmaz",
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
      title: "Generative Materials Models",
      description:
        "This Garden contains models that take free text as input and produce molecular structures as output. Models include: - Chemeleon from Hyunsoo Park and Aron Walsh at University College London - AtomGPT from Kamal Choudhary at the National Institute of Standards and Technology",
      doi: "10.26311/6phn-gv02",
      publisher: "Hyunsoo Park",
      owner: "Hyunsoo Park",
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
            Publish and Run Scientific AI Models with <span className="text-brightgreen">Garden</span>
          </h1>
          <p className="mx-auto mb-8 mt-8 max-w-2xl text-xl text-gray-600">
            Run frontier models in materials science, biology, and physics with two lines of Python.
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

      <div className="mx-auto max-w-5xl mb-12">
        <div className="mt-12 px-4 ">
          <div className="flex items-baseline">
            <h1 className="text-3xl font-semibold">Science Needs More Than Chatbots</h1>
          </div>
          <h2 className="mt-2 text-lg">
            There are many great platforms for hosting chatbots.
            But you work in science, and you want the best model for predicting
            <Link to="/garden/10.26311/ep98-br79" className="text-green hover:text-darkgreen hover:underline"> material tensile strength</Link> or the 
            <Link to="/garden/10.26311/hhwc-0v60" className="text-green hover:text-darkgreen hover:underline"> behavior of neutron stars</Link>.
            Garden is the best place to find, share, and run specialized AI models for science. (Scientific chatbots are welcome too.)
          </h2>
        </div>
      </div>

      <div className="bg-green pt-6">
        <div className="mx-auto max-w-5xl px-4 pb-2">
          <div className="text-white">
            <h1 className="text-left text-3xl font-semibold">
              <div className="flex space-x-4">
                <Sprout size={35} className="my-auto" />
                <h3>Featured Gardens </h3>
              </div>
            </h1>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="flex justify-center space-x-4 p-4 ">
            {gardens?.map((res: any, index: any) => (
              <div className="h-[250px] w-[300px]" key={index}>
                <GardenBox garden={res} allowEdits={false} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-12 mt-16 max-w-5xl md:flex">
          <div className="mt-12 px-4 md:mt-4 md:w-5/12">
            <h1 className="text-3xl font-semibold">Reproducible Science Needs On-Demand Models</h1>
            <h2 className="mt-4 text-lg">
              It can take days to get another lab's model running. 
              Models hosted on Garden are runnable in seconds, so you can build on others' work.
              (And you can get real users and citations for models you've developed.)
            </h2>
          </div>

          <div className="mx-auto mt-4 md:w-5/12">
            <Accordion type="single" collapsible className="mb-10 border-y" defaultValue="materials">
              <AccordionItem value="one">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <Container className="text-gray-500" />
                    <span className="font-medium text-gray-700">Containerized Model Runtimes</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        Even if someone shares a conda.yml, getting the right mix of science and ML libraries installed can be a pain.
                        Models on Garden are pre-bundled with their requirements so you don't have to worry about it.{" "}
                      </p>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="two">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <Cpu className="text-gray-500" />
                    <span className="font-medium text-gray-700">GPU Access</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        Models are paired with the GPU they need to run effectively. Garden provides researchers free monthly GPU quotas to try out models. 
                      </p>
                      <p className="text-base text-gray-800 pt-2">
                        For large production runs, you can "bring your own compute" by applying HPC allocations or cloud credits.{" "}
                      </p>
                      
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="three">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <Atom className="text-gray-500" />
                    <span className="font-medium text-gray-700">Linked Scientific Datasets</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        Pull in large scientific datasets from repositories like the{" "}
                        <a
                          href="https://materialsdatafacility.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green hover:text-darkgreen hover:underline"
                        >
                          Materials Data Facility
                        </a>{" "}
                        and set up benchmarks for your sub-discipline.
                      </p>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="four">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <GitBranch className="text-gray-500" />
                    <span className="font-medium text-gray-700">Hugging Face and GitHub Integration</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        If you already publish your model weights on Hugging Face, that's great! 
                        Garden's job is on-demand inference, not file storage.
                      </p>
                      <p className="text-base text-gray-800 pt-2">
                        We recommend users publish their model weights and code on open repositories 
                        like Hugging Face and use Garden to make them runnable on-demand.{" "}
                      </p>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

      </div>
      

      <div className="mx-auto mt-12 max-w-5xl px-4 mb-12">
        <h2 className="text-3xl font-semibold">Get Started in Seconds</h2>
        <div className="mx-auto max-w-6xl pt-4">
          <div className="flex flex-col items-center space-y-8 md:flex-row md:space-x-12 md:space-y-0">
            <div className="w-full text-sm md:w-1/2">
              <SyntaxHighlighter>
                {`# "pip install garden-ai" first
from garden_ai import GardenClient

garden_client = GardenClient()
g = garden_client.get_garden("10.26311/ep98-br79")

materials = ['AgI', 'CdTe', 'BN']
# Run the model remotely and retrieve your results
result = g.predict_piezoelectric_displacement(materials)`}
              </SyntaxHighlighter>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="mb-4 text-2xl font-semibold">Easy To Run, Easy To Publish</h3>
              <p className="mb-6 text-lg">
                  Garden uses{" "}
                  <a
                    href="https://modal.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green hover:text-darkgreen hover:underline"
                  >
                    Modal
                  </a>{" "}
                  to run models in the cloud and{" "}
                  <a
                    href="https://www.globus.org/compute"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green hover:text-darkgreen hover:underline"
                  >
                    Globus Compute
                  </a>{" "}
                  to run models on Research computing clusters.
                  
                  {" "}
                  <a
                    href="https://garden-ai.readthedocs.io/en/latest/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green hover:text-darkgreen hover:underline"
                  >
                    Read our documentation
                  </a>{" "}
                  to learn how to publish your models with Garden.
              </p>
            </div>
          </div>
        </div>
      </div>

      

      
    </div>
  );
};

export default HomePage;
