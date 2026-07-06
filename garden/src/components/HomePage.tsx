import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout, Container, Cpu, Atom, GitBranch, Cloud, BookOpen } from "lucide-react";
import { useGlobusAuth } from "@globus/react-auth-context";
import GardenBox from "@/features/gardens/components/GardenBox";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";
import { Garden } from "@/types";
import UChicagoLogo from "@/svgs/logos/uchicago";
import NSFLogo from "@/svgs/logos/nsf";
import WisconsinLogo from "@/svgs/logos/badger";
import ArgonneLogo from "@/svgs/logos/argonne";
import DOELogo from "@/svgs/logos/doe";
import MITLogo from "@/svgs/logos/beaver";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import CopyButton from "@/components/CopyButton";
import AlmanacSection from "@/components/AlmanacSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";

const runLanes = [
  {
    icon: Cloud,
    name: "Modal cloud",
    description:
      "One click or a few lines of Python — models run on managed cloud GPUs with zero setup.",
    detail: "Free monthly GPU quota for researchers",
    badge: null,
  },
  {
    icon: Cpu,
    name: "Your HPC allocation",
    description:
      "Run at scale on research supercomputers through Globus Compute, using the allocation you already have.",
    detail: "Use your existing allocation",
    badge: null,
  },
  {
    icon: BookOpen,
    name: "The Almanac",
    description:
      "The top machine-learned interatomic potentials, pre-installed on HPC clusters and cataloged so the right model is easy to find.",
    detail: "50+ curated MLIPs",
    badge: null,
  },
];

const workflowSteps = [
  {
    title: "Discover",
    description: "Search tested AI models and functions.",
  },
  {
    title: "Run",
    description: "Run models at scale with high performance infrastructure.",
  },
  {
    title: "Customize",
    description: "Adapt models to your data and research needs.",
  },
  {
    title: "Share",
    description: "Publish your models and collaborate openly.",
  },
];

const getStartedCode = `# "pip install garden-ai" first
from garden_ai import GardenClient

garden_client = GardenClient()
g = garden_client.get_garden("10.26311/ep98-br79")

materials = ['AgI', 'CdTe', 'BN']
# Run the model remotely and retrieve your results
result = g.predict_piezoelectric_displacement(materials)`;

const HomePage = () => {
  const auth = useGlobusAuth();
  const { isAuthenticated, authorization } = auth;

  useEffect(() => {
    async function getToken() {
      if (!authorization?.handleCodeRedirect || isAuthenticated) return;
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
      doi_is_draft: false,
      publisher: "Hayden Holbrook",
      owner: "Hayden Holbrook",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      hpc_function_ids: [],
      authors: [],
      contributors: [],
      marked_for_deletion: null,
      state: "PUBLISHED",
    },
    {
      title: "Materials Property Prediction with MAST-ML",
      description:
        "Random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance. Models are trained and executed with the Materials Simulation Toolkit for Machine Learning (MAST-ML) from the UW-Madison Computational Materials Group.",
      doi: "10.26311/ep98-br79",
      doi_is_draft: false,
      publisher: "Ryan Jacobs",
      owner: "Ryan Jacobs",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      hpc_function_ids: [],
      authors: [],
      contributors: [],
      marked_for_deletion: null,
      state: "PUBLISHED",
    },
    {
      title: "Conservative to Primitive Conversion in Relativistic Hydrodynamics",
      description:
        "This garden hosts a suite of PyTorch models (and corresponding TensorRT engines) trained for conservative-to-primitive variable recovery in numerical relativity simulations ...",
      doi: "10.26311/hhwc-0v60",
      doi_is_draft: false,
      publisher: "Semih Kacmaz",
      owner: "Semih Kacmaz",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      hpc_function_ids: [],
      authors: [],
      contributors: [],
      marked_for_deletion: null,
      state: "PUBLISHED",
    },
    {
      title: "Generative Materials Models",
      description:
        "This Garden contains models that take free text as input and produce molecular structures as output. Models include: Chemeleon from Hyunsoo Park and Aron Walsh at University College London, and AtomGPT from Kamal Choudhary at the National Institute of Standards and Technology.",
      doi: "10.26311/6phn-gv02",
      doi_is_draft: false,
      publisher: "Hyunsoo Park",
      owner: "Hyunsoo Park",
      language: "English",
      version: "1.0",
      is_archived: false,
      entrypoint_ids: ["entrypoint1", "entrypoint2"],
      owner_identity_id: "100",
      id: 100,
      modal_function_ids: [],
      hpc_function_ids: [],
      authors: [],
      contributors: [],
      marked_for_deletion: null,
      state: "PUBLISHED",
    },
  ];

  return (
    <div className="font-inter">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] flex-col overflow-hidden bg-darkSlate">
        <img
          src="img/hero-bloom.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[22%_center] sm:object-[70%_center]"
        />
        {/* Scrim: heavy over the headline zone, light over the artwork */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-darkSlate/95 via-darkSlate/80 to-darkSlate/40" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #108981 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.1,
          }}
        />

        {/* Content — flex-1 so it fills the space above the logos strip */}
        <div className="relative z-10 flex flex-1 items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <h1 className="mb-6 font-grotesk text-4xl font-bold leading-[1.1] tracking-tight text-white [text-wrap:balance] sm:text-5xl">
                Run frontier AI models.
                <br />
                Advance <span className="text-green">scientific discovery.</span>
              </h1>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-200">
                Garden is the open platform to discover, run, and share AI models for materials
                science, biology, chemistry, physics, and beyond.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/search">
                  <button className="flex items-center gap-2 rounded-lg bg-teal px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-deepTeal">
                    Explore Models
                    <ArrowRight size={18} />
                  </button>
                </Link>
                <Link to="/garden/create">
                  <button className="flex items-center gap-2 rounded-lg border border-slate-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:border-slate-300">
                    Start Your Garden
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional logos strip */}
        <div className="relative z-10 border-t border-slate-800 bg-[#0a1628]">
          <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-500">
              <a
                href="https://www.uchicago.edu/en"
                target="_blank"
                rel="noreferrer"
                aria-label="University of Chicago"
                className="transition-colors hover:text-slate-300"
              >
                <UChicagoLogo />
              </a>
              <a
                href="https://www.nsf.gov/"
                target="_blank"
                rel="noreferrer"
                aria-label="National Science Foundation"
                className="transition-colors hover:text-slate-300"
              >
                <NSFLogo />
              </a>
              <a
                href="https://www.wisc.edu/"
                target="_blank"
                rel="noreferrer"
                aria-label="University of Wisconsin–Madison"
                className="transition-colors hover:text-slate-300"
              >
                <WisconsinLogo />
              </a>
              <a
                href="https://www.anl.gov/"
                target="_blank"
                rel="noreferrer"
                aria-label="Argonne National Laboratory"
                className="pb-4 transition-colors hover:text-slate-300"
              >
                <ArgonneLogo />
              </a>
              <a
                href="https://www.energy.gov/"
                target="_blank"
                rel="noreferrer"
                aria-label="U.S. Department of Energy"
                className="transition-colors hover:text-slate-300"
              >
                <DOELogo />
              </a>
              <a
                href="https://www.mit.edu/"
                target="_blank"
                rel="noreferrer"
                aria-label="Massachusetts Institute of Technology"
                className="w-24 pb-4 pt-3 transition-colors hover:text-slate-300"
              >
                <MITLogo />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Everything you need to innovate ── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 max-w-2xl">
            <h2 className="mb-3 font-grotesk text-3xl font-bold text-gray-900">
              Everything you need to innovate
            </h2>
            <p className="text-lg text-gray-600">
              One workflow, from finding a model to publishing your own.
            </p>
          </div>
          <ol className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map(({ title, description }, i) => (
              <li key={title} className="border-t border-gray-300 pt-5">
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="font-grotesk text-sm font-semibold tabular-nums text-teal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-grotesk text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Run models where you work ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 max-w-2xl">
            <h2 className="mb-3 font-grotesk text-3xl font-bold text-gray-900">
              Run models where you work
            </h2>
            <p className="text-lg text-gray-600">
              Every model on Garden runs on demand — on managed cloud GPUs or the supercomputers you
              already use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-200">
            {runLanes.map(({ icon: Icon, name, description, detail, badge }) => (
              <div
                key={name}
                className="border-t border-gray-200 py-6 first:border-t-0 first:pt-0 last:pb-0 md:border-t-0 md:px-8 md:py-2 md:first:pl-0 md:last:pr-0"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <Icon className="flex-shrink-0 text-teal" size={20} strokeWidth={1.8} />
                  <h3 className="font-grotesk text-lg font-semibold text-gray-900">{name}</h3>
                  {badge && (
                    <span className="whitespace-nowrap rounded-full border border-teal/40 bg-teal/10 px-2 py-0.5 text-[11px] font-semibold text-deepTeal">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">{description}</p>
                <p className="text-sm font-medium text-deepTeal">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Almanac of Matter Models + Rootstock ── */}
      <AlmanacSection />

      {/* ── Featured Gardens ── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-3 font-grotesk text-3xl font-bold text-gray-900">
              <Sprout className="text-teal" size={28} />
              Featured Gardens
            </h2>
            <Link
              to="/search"
              className="flex items-center gap-1 text-sm font-medium text-teal no-underline hover:text-deepTeal hover:underline"
            >
              Explore all <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="mx-auto flex max-w-5xl gap-4 px-6 pb-4">
            {gardens.map((res: Garden, index: number) => (
              <div className="h-[260px] w-[300px] flex-shrink-0" key={index}>
                <GardenBox garden={res} allowEdits={false} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* ── Reproducible Science ── */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="md:flex md:gap-16">
            <div className="mb-10 md:mb-0 md:w-5/12">
              <h2 className="mb-4 font-grotesk text-3xl font-bold text-gray-900">
                Reproducible science needs on-demand models
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                It can take days to get another lab&apos;s model running. Models hosted on Garden
                are runnable in seconds, so you can build on others&apos; work. (And you can get
                real users and citations for models you&apos;ve developed.)
              </p>
            </div>

            <div className="md:w-7/12">
              <Accordion type="single" collapsible className="border-y border-gray-200">
                <AccordionItem value="one">
                  <AccordionTrigger className="px-4 py-3 transition-colors hover:bg-gray-100 data-[state=open]:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Container className="flex-shrink-0 text-teal" size={18} />
                      <span className="font-medium text-gray-800">
                        Containerized Model Runtimes
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-5">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                      <p className="text-gray-700">
                        Even if someone shares a conda.yml, getting the right mix of science and ML
                        libraries installed can be a pain. Models on Garden are pre-bundled with
                        their requirements so you don&apos;t have to worry about it.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="two">
                  <AccordionTrigger className="px-4 py-3 transition-colors hover:bg-gray-100 data-[state=open]:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Cpu className="flex-shrink-0 text-teal" size={18} />
                      <span className="font-medium text-gray-800">GPU Access</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-5">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                      <p className="text-gray-700">
                        Models are paired with the GPU they need to run effectively — on
                        Garden&apos;s free monthly quota, or at scale with your own HPC allocation
                        or cloud credits.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="three">
                  <AccordionTrigger className="px-4 py-3 transition-colors hover:bg-gray-100 data-[state=open]:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Atom className="flex-shrink-0 text-teal" size={18} />
                      <span className="font-medium text-gray-800">Linked Scientific Datasets</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-5">
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                      <p className="text-gray-700">
                        Pull in large scientific datasets from repositories like the{" "}
                        <a
                          href="https://materialsdatafacility.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal hover:text-deepTeal hover:underline"
                        >
                          Materials Data Facility
                        </a>{" "}
                        and set up benchmarks for your sub-discipline.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="four">
                  <AccordionTrigger className="px-4 py-3 transition-colors hover:bg-gray-100 data-[state=open]:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <GitBranch className="flex-shrink-0 text-teal" size={18} />
                      <span className="font-medium text-gray-800">
                        Hugging Face and GitHub Integration
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-5">
                    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-5">
                      <p className="text-gray-700">
                        If you already publish your model weights on Hugging Face, that&apos;s
                        great! Garden&apos;s job is on-demand inference, not file storage.
                      </p>
                      <p className="text-gray-700">
                        We recommend users publish their model weights and code on open repositories
                        like Hugging Face and use Garden to make them runnable on-demand.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ── Get Started in Seconds ── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 font-grotesk text-3xl font-bold text-gray-900">
            Get started in seconds
          </h2>
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="relative w-full text-sm md:w-1/2">
              <CopyButton
                content={getStartedCode}
                className="absolute right-2 top-2 z-10 bg-white/90 text-gray-600 hover:text-gray-900"
                aria-label="Copy get started code example"
              />
              <SyntaxHighlighter>{getStartedCode}</SyntaxHighlighter>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="mb-4 font-grotesk text-2xl font-semibold text-gray-900">
                Easy to run, easy to publish
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                Garden uses{" "}
                <a
                  href="https://modal.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal hover:text-deepTeal hover:underline"
                >
                  Modal
                </a>{" "}
                to run models in the cloud and{" "}
                <a
                  href="https://www.globus.org/compute"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal hover:text-deepTeal hover:underline"
                >
                  Globus Compute
                </a>{" "}
                to run models on Research computing clusters.{" "}
                <a
                  href="https://garden-ai.readthedocs.io/en/latest/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal hover:text-deepTeal hover:underline"
                >
                  Read our documentation
                </a>{" "}
                to learn how to publish your models with Garden.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
