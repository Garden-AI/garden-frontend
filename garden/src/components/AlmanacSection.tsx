import React from "react";
import { ArrowRight } from "lucide-react";
import CopyButton from "@/components/CopyButton";

// Hand-tinted code sample — the global .hljs theme is light-only, so this dark
// section styles its own <pre> instead of using <SyntaxHighlighter>.
const kw = "text-[#5EEAD4]";
const str = "text-lime";
const cmt = "text-slate-400";

const almanacCode = `from ase.build import bulk
from rootstock import RootstockCalculator

atoms = bulk("Cu", "fcc", a=3.58)

with RootstockCalculator(
    cluster="polaris",
    checkpoint="mace-mp-0-medium", # swap models here
    device="cuda",
) as calc:
    atoms.calc = calc
    energy = atoms.get_potential_energy()`;

const AlmanacSection = () => {
  return (
    <section className="relative overflow-hidden bg-darkSlate py-20 lg:py-24">
      {/* Dot-grid texture shared with the hero */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #108981 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.08,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Narrative */}
          <div>
            <h2 className="mb-5 font-grotesk text-3xl font-bold text-white [text-wrap:balance] lg:text-4xl">
              The Almanac of Matter Models
            </h2>
            <p className="mb-4 max-w-xl text-lg leading-relaxed text-slate-300">
              A living registry of 50+ machine-learned interatomic potentials — MACE, EquiformerV2,
              GemNet, and more — pre-installed, verified, and ready to run on the supercomputers you
              already use.
            </p>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
              Its companion library, Rootstock, runs each model family in its own isolated
              environment behind a single ASE-compatible calculator. Swapping models is a one-line
              change, not an afternoon of dependency surgery.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="https://garden-ai.github.io/almanac/" target="_blank" rel="noreferrer">
                <button className="flex items-center gap-2 rounded-lg bg-teal px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-deepTeal">
                  Browse the Almanac
                  <ArrowRight size={18} />
                </button>
              </a>
              <a href="https://garden-ai.github.io/rootstock/" target="_blank" rel="noreferrer">
                <button className="flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:border-slate-400">
                  Rootstock docs
                </button>
              </a>
            </div>
          </div>

          {/* Code sample */}
          <div className="overflow-hidden rounded-xl border border-slate-700/70 bg-[#0B1120] shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-2.5">
              <span className="font-mono text-xs text-slate-400">relax_structure.py</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">any MLIP, one calculator</span>
                <CopyButton
                  content={almanacCode}
                  className="h-7 w-7 text-slate-400 hover:text-white"
                  aria-label="Copy Almanac code example"
                />
              </div>
            </div>
            <pre className="font-mono overflow-x-auto p-5 text-[13px] leading-relaxed text-slate-200">
              <code>
                <span className={kw}>from</span> ase.build <span className={kw}>import</span> bulk
                {"\n"}
                <span className={kw}>from</span> rootstock <span className={kw}>import</span>{" "}
                RootstockCalculator{"\n\n"}
                atoms = bulk(<span className={str}>&quot;Cu&quot;</span>,{" "}
                <span className={str}>&quot;fcc&quot;</span>, a=<span className={str}>3.58</span>)
                {"\n\n"}
                <span className={kw}>with</span> RootstockCalculator({"\n"}
                {"    "}cluster=<span className={str}>&quot;polaris&quot;</span>,{"\n"}
                {"    "}checkpoint=<span className={str}>&quot;mace-mp-0-medium&quot;</span>,{" "}
                <span className={cmt}># swap models here</span>
                {"\n"}
                {"    "}device=<span className={str}>&quot;cuda&quot;</span>,{"\n"}){" "}
                <span className={kw}>as</span> calc:{"\n"}
                {"    "}atoms.calc = calc{"\n"}
                {"    "}energy = atoms.get_potential_energy()
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlmanacSection;
