import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GardenBox from "@/components/GardenBox";
import { useSearchGardens } from "../api/search";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Rocket, Share2Icon, Lightbulb, Search } from "lucide-react";

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

const Landing = () => {
  const { data: gardens } = useSearchGardens("*", "6");

  return (
    <div className="font-display">
      <h2 className="text-xl lg:text-2xl">search for gardens</h2>
      <h2 className="text-xl lg:text-2xl">
        We make it simple to research using ML.
      </h2>
      <h1 className="mb-6 text-3xl font-semibold lg:mb-24 lg:text-5xl">
        Build a garden where your model can thrive.
      </h1>

      <h2 className="text-xl lg:text-2xl">Start a new Garden</h2>

      <h2 className="text-xl lg:text-2xl">The Plot is yours</h2>

      <h2 className="text-xl lg:text-2xl">
        Gardens are collections of ML models that are linked with data and
        computing resources to advance the work of research communities. These
        gardens make it easy to publish models which can be integrated into
        academia and industry alike. Researchers can provide broad access to
        their models, without having to worry about the difficulties surrounding
        discovery, access, and deployment.
      </h2>

      <div className="my-10 text-center">
        <Link
          to="/search"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "rounded-lg",
          )}
        >
          Search
        </Link>
      </div>

      <h2 className="text-xl lg:text-2xl">New to garden?</h2>

      <h2 className="text-xl lg:text-2xl">
        Publish your first garden within 15 minutes. Read our user guide to get
        started.
      </h2>

      <h2 className="text-xl lg:text-2xl">
        Getting started is easy. We do the hard work so you don’t have to.{" "}
      </h2>

      <h2 className="text-xl lg:text-2xl">
        We automate the process from start to finish so you can spend more time
        browsing gardens and less time fussing with setting up models.
      </h2>

      <h2 className="text-xl lg:text-2xl">create an account</h2>

      <h2 className="text-xl lg:text-2xl">
        Research using ML doesn’t have to be hard.
      </h2>

      <h2 className="text-xl lg:text-2xl">
        We overcome the barriers surrounding ML, so that you can spend more time
        researching and less time setting up code to run models.
      </h2>

      <h2 className="text-xl lg:text-2xl">
        Reproducibility. Sharing code and data in a way that others can actually
        use it is difficult.
      </h2>

      <h2 className="text-xl lg:text-2xl">
        Accessibility. Code and data are rarely available to the public, and
        most require inaccessible compute.
      </h2>

      <h2 className="text-xl lg:text-2xl">
        Quality. Getting your environment up and running to test if your code
        works takes time.{" "}
      </h2>

      <h2 className="text-xl lg:text-2xl">
        Community. Finding and connecting with people working on similar or
        relevant problems is next to impossible.
      </h2>

      <Separator />
      <div className="mx-auto grid max-w-7xl grid-cols-1 justify-around gap-x-12 gap-y-24 px-24 py-16 md:grid-cols-3 ">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="flex h-48 flex-col items-center gap-y-12  text-center "
          >
            <div className="w-full">
              <icon.icon size={110} className="mx-auto w-full text-primary" />
            </div>
            <p className="text-center md:text-xl">{icon.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-12 md:px-20">
        {textSections.map((section, index) => (
          <div key={index}>
            <Separator />
            <div key={index} className="my-12">
              <h1 className="mb-6 text-3xl font-semibold">{section.header}</h1>
              <p className="mb-1">{section.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Separator />

      <div className=" px-5 py-8 font-display sm:px-12 md:px-20">
        <h1 className="pb-10 text-left text-xl font-semibold sm:text-3xl lg:text-4xl">
          <div className="flex space-x-4">
            <Rocket size={35} className="my-auto" />
            <h3>Explore Featured Gardens </h3>
          </div>
        </h1>
        <p className="text-md mb-8 sm:text-lg">
          Take a look at some popular gardens that have been getting a lot of
          attention! You can view the models, datasets, papers, and anything
          else associated with the garden. Additionally, you can run the models
          to optimize your own workflow, gain inspiration, or for any other
          reason you see fit.
        </p>

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

export default Landing;
