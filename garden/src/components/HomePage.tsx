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
  ArrowRight,
  Leaf
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
    <div className="font-display bg-[#f9f9f9]">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-48">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F2FCE2]/60 via-white/70 to-[#9b87f5]/20 z-0"></div>
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-5 z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[130%] rounded-full bg-gradient-to-br from-[#9b87f5]/20 to-[#9b87f5]/5 blur-3xl rotate-12 z-0"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[130%] rounded-full bg-gradient-to-tl from-[#F2FCE2]/30 to-[#F2FCE2]/10 blur-3xl -rotate-12 z-0"></div>

        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1F2C] bg-clip-text text-transparent bg-gradient-to-r from-[#1A1F2C] to-[#1A1F2C]/80">
            Scientific AI Models<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#9b87f5]/80">Made Accessible</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl md:text-2xl text-[#1A1F2C]/70 leading-relaxed">
          Run frontier models in materials science, biology, and physics with two lines of Python.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12">
            <Link to="/search">
              <button className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#9b87f5] to-[#8a78e0] px-8 py-4 text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                Explore Models
              </button>
            </Link>
            <Link to="/garden/create">
              <button className="w-full sm:w-auto rounded-full border border-[#F2FCE2]/60 bg-white/90 backdrop-blur-md px-8 py-4 text-lg font-semibold text-[#1A1F2C] shadow-sm hover:bg-gradient-to-r hover:from-[#F2FCE2]/40 hover:to-white/90 hover:text-[#1A1F2C] hover:shadow-md transition-all duration-300">
                <span className="flex items-center">
                  <Leaf size={18} className="mr-2 text-[#76c893]" />
                  Start Your Garden
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="backdrop-blur-md bg-gradient-to-r from-white/90 to-white/80 border-y border-[#8E9196]/10 shadow-sm px-8 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 hover:opacity-80 transition-opacity duration-500">
            <a href="https://www.uchicago.edu/en" target="_blank" className="transition-all duration-300 hover:scale-105">
              <UChicagoLogo />
            </a>
            <a href="https://www.nsf.gov/" target="_blank" className="transition-all duration-300 hover:scale-105">
              <NSFLogo />
            </a>
            <a href="https://www.wisc.edu/" target="_blank" className="transition-all duration-300 hover:scale-105">
              <WisconsinLogo />
            </a>
            <a href="https://www.anl.gov/" target="_blank" className="transition-all duration-300 hover:scale-105">
              <ArgonneLogo />
            </a>
            <a href="https://www.energy.gov/" target="_blank" className="transition-all duration-300 hover:scale-105">
              <DOELogo />
            </a>
            <a href="https://www.mit.edu/" target="_blank" className="transition-all duration-300 hover:scale-105 w-24">
              <MITLogo />
            </a>
          </div>
        </div>
      </div>

      {/* Science Section */}
      <div className="mx-auto max-w-5xl py-24 px-6">
        <div className="backdrop-blur-md bg-gradient-to-br from-white/90 to-white/80 border-l-4 border-l-[#76c893] border-t border-r border-b border-white/40 shadow-lg rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1F2C]">
            Science Needs More Than Chatbots
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[#1A1F2C]/70 leading-relaxed">
            There are many great platforms for hosting chatbots.
            But you want the best model for predicting

            <Link to="/garden/10.26311/ep98-br79" className="text-[#76c893]"> material tensile strength</Link> or the 
            <Link to="/garden/10.26311/hhwc-0v60" className="text-[#9b87f5] hover:text-[#9b87f5]/80 hover:underline"> behavior of neutron stars</Link>.
            Garden is the best place to find, share, and run specialized AI models for science. (Scientific chatbots are welcome too.)
          </p>
        </div>
      </div>

      {/* Featured Gardens */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5] via-[#9482eb] to-[#8e7de1] z-0"></div>
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-10 z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#76c893] via-[#b7e4c7] to-transparent z-10"></div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-white mb-8">
            <h2 className="text-3xl font-bold tracking-tight flex items-center">
              <Sprout size={28} className="mr-3 text-[#b7e4c7]" />
              Featured Gardens
            </h2>
          </div>

          <ScrollArea className="w-full pb-6">
            <div className="flex space-x-5 py-4">
              {gardens?.map((garden: Garden, index: number) => (
                <div className="h-[320px] w-[350px] flex-shrink-0" key={index}>
                  <div className="h-full w-full backdrop-blur-lg bg-gradient-to-br from-white/95 to-white/90 border border-white/30 border-t-[#b7e4c7]/50 border-t-2 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white/95 hover:to-[#F2FCE2]/30">
                    <GardenBox garden={garden} allowEdits={false} />
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="mt-2" />
          </ScrollArea>
        </div>
      </div>

      {/* Reproducible Science Section */}
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F2FCE2]/20 to-white/90 z-0"></div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="md:flex md:gap-16 items-center">
            <div className="md:w-5/12 mb-12 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1F2C]">
                Reproducible Science<br />Needs On-Demand Models
              </h2>
              <p className="mt-6 text-lg text-[#1A1F2C]/70 leading-relaxed">
                It can take days to get another lab's model running. 
                Models hosted on Garden are runnable in seconds, so you can build on others' work.
                (And you can get real users and citations for models you've developed.)
              </p>
            </div>

            <div className="md:w-7/12">
              <div className="backdrop-blur-md bg-gradient-to-br from-white/95 to-white/85 border border-white/40 border-r-[#b7e4c7]/50 border-r-4 shadow-lg rounded-2xl overflow-hidden">
                <Accordion type="single" collapsible className="divide-y" defaultValue="materials">
                  <AccordionItem value="one" className="border-none">
                    <AccordionTrigger className="px-6 py-5 hover:bg-gradient-to-r hover:from-[#F2FCE2]/20 hover:to-transparent data-[state=open]:bg-gradient-to-r data-[state=open]:from-[#F2FCE2]/30 data-[state=open]:to-transparent">
                      <div className="flex items-center gap-x-3">
                        <Container className="text-[#9b87f5]" />
                        <span className="font-medium text-[#1A1F2C]">Containerized Model Runtimes</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <div className="text-[#1A1F2C]/80 leading-relaxed">
                        Even if someone shares a conda.yml, getting the right mix of science and ML libraries installed can be a pain.
                        Models on Garden are pre-bundled with their requirements so you don't have to worry about it.
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="two" className="border-none">
                    <AccordionTrigger className="px-6 py-5 hover:bg-gradient-to-r hover:from-[#F2FCE2]/20 hover:to-transparent data-[state=open]:bg-gradient-to-r data-[state=open]:from-[#F2FCE2]/30 data-[state=open]:to-transparent">
                      <div className="flex items-center gap-x-3">
                        <Cpu className="text-[#9b87f5]" />
                        <span className="font-medium text-[#1A1F2C]">GPU Access</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <div className="text-[#1A1F2C]/80 leading-relaxed">
                        <p>
                          Models are paired with the GPU they need to run effectively. Garden provides researchers free monthly GPU quotas to try out models.
                        </p>
                        <p className="mt-3">
                          For large production runs, you can "bring your own compute" by applying HPC allocations or cloud credits.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="three" className="border-none">
                    <AccordionTrigger className="px-6 py-5 hover:bg-gradient-to-r hover:from-[#F2FCE2]/20 hover:to-transparent data-[state=open]:bg-gradient-to-r data-[state=open]:from-[#F2FCE2]/30 data-[state=open]:to-transparent">
                      <div className="flex items-center gap-x-3">
                        <Atom className="text-[#9b87f5]" />
                        <span className="font-medium text-[#1A1F2C]">Linked Scientific Datasets</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <div className="text-[#1A1F2C]/80 leading-relaxed">
                        Pull in large scientific datasets from repositories like the{" "}
                        <a
                          href="https://materialsdatafacility.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#76c893] hover:text-[#52b69a] hover:underline"
                        >
                          Materials Data Facility
                        </a>{" "}
                        and set up benchmarks for your sub-discipline.
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="four" className="border-none">
                    <AccordionTrigger className="px-6 py-5 hover:bg-gradient-to-r hover:from-[#F2FCE2]/20 hover:to-transparent data-[state=open]:bg-gradient-to-r data-[state=open]:from-[#F2FCE2]/30 data-[state=open]:to-transparent">
                      <div className="flex items-center gap-x-3">
                        <GitBranch className="text-[#9b87f5]" />
                        <span className="font-medium text-[#1A1F2C]">Hugging Face and GitHub Integration</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <div className="text-[#1A1F2C]/80 leading-relaxed">
                        <p>
                          If you already publish your model weights on Hugging Face, that's great! 
                          Garden's job is on-demand inference, not file storage.
                        </p>
                        <p className="mt-3">
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
        </div>
      </div>

      {/* Get Started Section */}
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F2FCE2]/50 via-white/95 to-[#9b87f5]/10 z-0"></div>
        <div className="absolute inset-0 bg-[url('/img/grid-pattern.png')] opacity-5 z-0"></div>
        
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1F2C] text-center mb-12">
            Get Started in <span className="text-[#76c893]">Seconds</span>
          </h2>
          
          <div className="md:flex items-center gap-12">
            <div className="w-full md:w-1/2 backdrop-blur-md bg-gradient-to-br from-white/90 to-white/80 rounded-2xl shadow-lg overflow-hidden mb-12 md:mb-0 border border-white/40 border-b-[#76c893]/50 border-b-4">
              <div className="bg-gradient-to-r from-[#1A1F2C] to-[#221F26] px-4 py-2 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-white/60 text-xs ml-4">garden_example.py</div>
              </div>
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
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A1F2C] mb-6">
                Easy To Run, Easy To Publish
              </h3>
              <p className="text-lg text-[#1A1F2C]/70 leading-relaxed mb-6">
                Garden uses{" "}
                <a
                  href="https://modal.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9b87f5] hover:text-[#9b87f5]/80 hover:underline"
                >
                  Modal
                </a>{" "}
                to run models in the cloud and{" "}
                <a
                  href="https://www.globus.org/compute"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#76c893] hover:text-[#52b69a] hover:underline"
                >
                  Globus Compute
                </a>{" "}
                to run models on Research computing clusters.
              </p>
              
              <Link 
                to="https://garden-ai.readthedocs.io/en/latest/" 
                target="_blank"
                className="inline-flex items-center group"
              >
                <span className="bg-gradient-to-r from-[#76c893] to-[#9b87f5] bg-clip-text text-transparent font-semibold">
                  Read our documentation
                </span>
                <ArrowRight size={16} className="ml-2 text-[#76c893] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
