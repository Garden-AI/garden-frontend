import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import CopyButton from "@/components/CopyButton";

const tabs = {
  Cloud: `from garden_ai import GardenClient
gc = GardenClient()
mlip_garden = gc.get_garden("mlip-garden")

# Kick off an on-demand relaxation job on cloud GPUs.
mlip_garden.relax(
    xyz_file_path="candidate_structures.xyz",
    model="mace",
    output_path="relaxed_structures.xyz",
)`,
  HPC: `from garden_ai import GardenClient
gc = GardenClient()
mlip_garden = gc.get_garden("mlip-garden")

# If you have an allocation on ALCF EDTB (aka Edith), 
# Garden can kick off a relaxation job for you.
edith_ep_id = "a01b9350-e57d-4c8e-ad95-b4cb3c4cd1bb"
job_id = mlip_garden.batch_relax(
    xyz_file_path="candidate_structures.xyz", 
    model="mace-mpa-0",
    cluster_id=edith_ep_id
)

# poll for the status of the batch job
status = mlip_garden.get_job_status(job_id)

# retrieve the results when status is "completed"
results = mlip_garden.get_results(job_id)`
};

export const CodeBlockMLIP = () => {
  const [activeTab, setActiveTab] = useState<"Cloud" | "HPC">("Cloud");
  const [height, setHeight] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeight = () => {
      if (ref.current) {
        ref.current.style.height = 'auto';
        const newHeight = ref.current.scrollHeight;
        setHeight(newHeight);
      }
    };

    const timeoutId = setTimeout(calculateHeight, 0);
    
    return () => clearTimeout(timeoutId);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const newHeight = ref.current.scrollHeight;
        setHeight(newHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyButtonLabel = `Copy ${activeTab} code example to clipboard`;

  return (
    <div className="relative w-full text-sm font-mono">
      <div className="flex justify-center -mb-4 z-10 relative px-2 sm:px-4">
        <div 
          className="flex gap-1 sm:gap-2 bg-white px-2 sm:px-4 py-1 rounded-full border border-blue-100 shadow max-w-full"
          role="tablist"
          aria-label="Code example tabs"
        >
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "Cloud" | "HPC")}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-white"
                  : "bg-white text-blue-600 border border-blue-100 hover:bg-blue-50"
              }`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`${tab.toLowerCase()}-panel`}
              id={`${tab.toLowerCase()}-tab`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 shadow-2xl ring-1 ring-blue-200/30 overflow-hidden mx-2 sm:mx-4 lg:mx-0">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
          <motion.div
            animate={{ height: height || 'auto' }}
            initial={false}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 rounded-xl"
            role="tabpanel"
            id={`${activeTab.toLowerCase()}-panel`}
            aria-labelledby={`${activeTab.toLowerCase()}-tab`}
          >
            <div
              ref={ref}
              className="relative p-4 sm:p-6 text-blue-100 overflow-auto"
            >
              <CopyButton
                content={tabs[activeTab]}
                className="absolute top-3 right-3 bg-white text-slate-800 rounded-md px-2 py-1 text-xs font-semibold shadow hover:bg-slate-100 transition z-10"
                aria-label={copyButtonLabel}
                title={copyButtonLabel}
              />
              <SyntaxHighlighter
                language="python"
                style={{
                  ...oneDark,
                  'pre[class*="language-"]': {
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                  },
                  'code[class*="language-"]': {
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  },
                }}
                customStyle={{
                  background: "transparent",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  lineHeight: "1.5",
                  whiteSpace: "pre",
                  overflow: "visible",
                }}
                wrapLines={true}
                showLineNumbers={false}
              >
                {tabs[activeTab]}
              </SyntaxHighlighter>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};