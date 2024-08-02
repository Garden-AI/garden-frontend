import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GardenBox from "@/components/GardenBox";
import { useSearchGardens } from "@/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Paperclip,
  MoveRight,
  Rocket,
  Share2Icon,
  Lightbulb,
  Search,
} from "lucide-react";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";

const icons = [
  { icon: Share2Icon, text: "Boost the visibility of your work" },
  {
    icon: Search,
    text: "Search for models specific to your research",
  },
  { icon: Lightbulb, text: "Find solutions to similar problems" },
];

const textSections = [
  {
    header: "We overcome barriers surrounding ML.",
    text: "We seek to create collections of ML models that are linked with the data and computing resources required to advance the work of research communities. These gardens make it easy to publish models that can be integrated into academia and industry alike. Researchers can provide broad access to their models, without having to worry about the difficulties surrounding discovery, access, and deployment.",
  },
  {
    header: "What are Gardens?",
    text: "Gardens contain a full ML ecosystem. Models, data, tests, and benchmarks are all linked together and are required to meet FAIR principles to ensure accessibility and reproducibility. Gardens allow you engage with a broader audience by making publication of models quick and easy. This is efficiently achieved through sub-sections of a garden called “entrypoints”.",
  },
  {
    header: "Entrypoints",
    text: "Entrypoints are pages within a garden where all the relevant models and its associated materials are stored. Each entrypoint is composed of steps such as input, function, output, etc. If a particular model is relevant in more than one garden, then that entrypoint can be reused and displayed across them all, as they are not garden specific. Entrypoints play a key role in the accessibility and reproducibility of a garden page.",
  },
];

const HomePage = () => {
  const auth = useGlobusAuth();
  useEffect(() => {
    async function getToken() {
      await auth.authorization?.handleCodeRedirect();
    }
    getToken();
  }, [auth]);

  const { data: gardens } = useSearchGardens("*", "6");

  return (
    <div className="font-display">
      <div className="mx-auto mt-24 max-w-5xl px-4 sm:flex sm:place-items-end">
        <div className="flex items-baseline sm:w-7/12">
          <h1 className="text-6xl font-semibold">Garden</h1>
          <div className="ml-2 hidden font-extrabold text-green sm:block sm:text-sm">
            <Link to="/search">
              <span className="group items-center sm:inline-flex">
                <p>Search for gardens</p>
                <MoveRight className="mx-1 h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
        <div className="ml-2 font-extrabold text-green sm:hidden">
          <Link to="/search">
            <span className="group inline-flex items-center">
              <p>Search for gardens</p>
              <MoveRight className="mx-2 h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
        <div className="mt-8 sm:w-5/12">
          <h2 className="text-l">We make it simple to research using ML.</h2>
          <h1 className="text-2xl font-semibold">
            Build a garden where your model can{" "}
            <span className="text-brightgreen">thrive.</span>
          </h1>
        </div>
      </div>

      <div className="w-full bg-hero bg-cover bg-center">
        <div className="flex h-full w-full items-center justify-center py-52">
          <div className="text-center">
            <div className="container mx-auto px-16">
              <div className="mx-auto max-w-4xl text-center"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl">
        <div className="mt-12 px-4 ">
          <div className="flex items-baseline">
            <h1 className="text-2xl font-semibold">Start a garden</h1>
            <p className="ml-4 font-extrabold text-green sm:text-sm">
              <a href="https://garden-ai.readthedocs.io/en/latest/user_guide/introduction/">
                <span className="group inline-flex items-center">
                  <p>The Plot is yours</p>
                  <MoveRight className="mx-2 h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1" />
                </span>
              </a>
            </p>
          </div>
          <h2 className="mt-2 text-base">
            Gardens are collections of ML models that are linked with data and
            computing resources to advance the work of research communities.
            These gardens make it easy to publish models which can be integrated
            into academia and industry alike. Researchers can provide broad
            access to their models, without having to worry about the
            difficulties surrounding discovery, access, and deployment.
          </h2>
        </div>

        {/* <Separator /> */}
        <div className="mx-auto grid  grid-cols-1 justify-around gap-x-12 gap-y-8 px-20 py-12 sm:grid-cols-3 ">
          {icons.map((icon, index) => (
            <div
              key={index}
              className="flex h-40 flex-col items-center text-center "
            >
              <div className="w-full">
                <icon.icon size={110} className="mx-auto w-full text-primary" />
              </div>
              <p className="text-center md:text-xl">{icon.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Separator />

      <div className="mx-auto max-w-5xl">
        <div className="mt-12 px-4">
          <h1 className="text-2xl font-semibold">New to garden?</h1>
          <h2 className="text-base">
            Publish your first garden within 15 minutes. Read our{" "}
            <a
              className="text-green"
              href="https://garden-ai.readthedocs.io/en/latest/user_guide/introduction/"
              target="_blank"
            >
              user guide
            </a>{" "}
            to get started.
          </h2>

          <div className="items-center sm:mx-8 sm:mt-8 sm:flex">
            <div className="order-1 sm:w-5/12">
              <img
                className="mx-auto object-contain p-8 sm:p-2"
                src="img/codeSnippetHomepage.jpg"
              ></img>
            </div>
            <div className="order-2 sm:w-7/12 sm:p-4">
              <h1 className="text-xl font-semibold">
                Getting started is easy. We do the hard work so you don’t have
                to.
              </h1>
              <h2 className="mt-2 text-base">
                We automate the process from start to finish so you can spend
                more time browsing gardens and less time fussing with setting up
                models.
              </h2>
              <p className="font-extrabold text-green sm:mt-2 sm:text-sm">
                <a href="https://garden-ai.readthedocs.io/en/latest/user_guide/introduction/">
                  <span className="group inline-flex items-center">
                    <p>Create an account</p>
                    <MoveRight className="mx-2 h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1" />
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="sm:mt-8 sm:flex">
          <div className="mt-12 px-4 sm:mt-8 sm:w-5/12">
            <h1 className="text-2xl font-semibold">
              Research using ML doesn’t have to be hard.
            </h1>
            <h2 className="mt-2 text-base">
              We overcome the barriers surrounding ML, so that you can spend
              more time researching and less time setting up code to run models.
            </h2>
          </div>

          <div className="mt-4 sm:w-6/12">
            <Accordion
              type="single"
              collapsible
              className="mb-10 border-y"
              defaultValue="materials"
            >
              <AccordionItem value="one">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <Paperclip className="text-gray-500" />
                    <span className="font-medium text-gray-700">
                      Reproducibility.
                    </span>
                    {/* <p>
                Sharing code and data in a way that others can actually use it
                is difficult.
              </p> */}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        There's a lot of code that goes into reproducing an ML
                        pipeline to get the desired output. We make every garden
                        easy to follow.{" "}
                      </p>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="two">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <Paperclip className="text-gray-500" />
                    <span className="font-medium text-gray-700">
                      Accessibility.
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        All code, data, testing is available and free without
                        any barriers to access. You can run models using our
                        compute resources at UChicago or any Globus Compute
                        endpoint.{" "}
                      </p>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="three">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <Paperclip className="text-gray-500" />
                    <span className="font-medium text-gray-700">Quality.</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        We test and evaluate models on our side, so you can
                        browse research without the time investment of doing all
                        of that yourself.{" "}
                      </p>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="four">
                <AccordionTrigger className="px-4 py-2 transition-colors duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100">
                  <div className="flex items-center gap-x-2 p-2">
                    <Paperclip className="text-gray-500" />
                    <span className="font-medium text-gray-700">
                      Community.
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 gap-4 py-6">
                  <>
                    <div className="rounded-md border bg-white p-6">
                      <p className="text-base text-gray-800 ">
                        Garden is a collaborative platform that connects
                        like-minded people. Find your ML community, collaborate,
                        and set new benchmarks in your domain.{" "}
                      </p>
                    </div>
                  </>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="bg-green pt-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-white">
            <h1 className="text-left text-2xl font-semibold">
              <div className="flex space-x-4">
                <Rocket size={35} className="my-auto" />
                <h3>Explore Featured Gardens </h3>
              </div>
            </h1>
            <p className="mt-2 text-base">
              Take a look at some popular gardens that have been getting a lot
              of attention! You can view the models, datasets, papers, and
              anything else associated with the garden. Additionally, you can
              run the models to optimize your own workflow, gain inspiration, or
              for any other reason you see fit.
            </p>
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
