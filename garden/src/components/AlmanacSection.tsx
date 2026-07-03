import { ArrowRight } from "lucide-react";

const clusters = [
  { name: "Polaris", facility: "ALCF" },
  { name: "Sophia", facility: "ALCF" },
  { name: "Perlmutter", facility: "NERSC" },
  { name: "Delta", facility: "NCSA" },
];

// Hand-tinted code sample — the global .hljs theme is light-only, so this dark
// section styles its own <pre> instead of using <SyntaxHighlighter>.
const kw = "text-[#5EEAD4]";
const str = "text-lime";
const cmt = "text-slate-400";

const AlmanacSection = () => {
  return (
    <section className="bg-darkSlate relative overflow-hidden py-20 lg:py-24">
      {/* Dot-grid texture shared with the hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #108981 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.08,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Narrative */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal/50 bg-teal/10 px-3 py-1 text-xs font-semibold text-slate-200 mb-6">
              <span
                className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse motion-reduce:animate-none"
                aria-hidden="true"
              />
              Coming soon
            </p>
            <h2 className="font-grotesk text-3xl lg:text-4xl font-bold text-white [text-wrap:balance] mb-5">
              The Almanac of Matter Models
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-4 max-w-xl">
              A living registry of 40+ machine-learned interatomic potentials — MACE,
              EquiformerV2, GemNet, and more — pre-installed, verified, and ready to run on
              the supercomputers you already use.
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
              Its companion library, Rootstock, runs each model family in its own isolated
              environment behind a single ASE-compatible calculator. Swapping models is a
              one-line change, not an afternoon of dependency surgery.
            </p>

            <div className="mb-10">
              <p className="text-sm text-slate-400 mb-3">Pre-installed on</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {clusters.map((c) => (
                  <div key={c.name}>
                    <div className="font-grotesk font-semibold text-white leading-tight">
                      {c.name}
                    </div>
                    <div className="text-xs text-slate-400">{c.facility}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="https://garden-ai.github.io/almanac/" target="_blank" rel="noreferrer">
                <button className="flex items-center gap-2 bg-teal hover:bg-deepTeal text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                  Browse the Almanac
                  <ArrowRight size={18} />
                </button>
              </a>
              <a href="https://garden-ai.github.io/rootstock/" target="_blank" rel="noreferrer">
                <button className="flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                  Rootstock docs
                </button>
              </a>
            </div>
          </div>

          {/* Code sample */}
          <div className="rounded-xl border border-slate-700/70 bg-[#0B1120] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-2.5 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-mono">relax_structure.py</span>
              <span className="text-xs text-slate-500">any MLIP, one calculator</span>
            </div>
            <pre className="p-5 text-[13px] leading-relaxed overflow-x-auto font-mono text-slate-200">
              <code>
                <span className={kw}>from</span> ase.build <span className={kw}>import</span>{" "}
                bulk{"\n"}
                <span className={kw}>from</span> rootstock <span className={kw}>import</span>{" "}
                RootstockCalculator{"\n\n"}
                atoms = bulk(<span className={str}>&quot;Cu&quot;</span>,{" "}
                <span className={str}>&quot;fcc&quot;</span>, a=<span className={str}>3.58</span>
                ){"\n\n"}
                <span className={kw}>with</span> RootstockCalculator({"\n"}
                {"    "}cluster=<span className={str}>&quot;polaris&quot;</span>,{"\n"}
                {"    "}checkpoint=<span className={str}>&quot;mace-mp-0-medium&quot;</span>,{" "}
                <span className={cmt}># swap models here</span>{"\n"}
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
