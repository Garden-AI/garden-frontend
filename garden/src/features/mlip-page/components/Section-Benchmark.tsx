export const SectionBenchmark = () => {

  return (
    <section
      id="benchmarking"
      className="relative overflow-hidden w-full px-6 py-16 md:py-20 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/40 text-slate-800"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#e2e8f0_1px,_transparent_1px)] [background-size:80px_80px] opacity-20 pointer-events-none" />
        <div className="absolute top-[20%] left-[10%] w-80 h-80 bg-gradient-to-br from-blue-100/30 to-slate-100/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-gradient-to-tr from-indigo-100/25 to-purple-100/20 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="mb-4 text-4xl font-serif font-bold tracking-tight text-slate-800">
          Cost Benchmarking
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mb-8 rounded-full" />

        <p className="text-lg md:text-xl text-slate-600 font-light mb-4 leading-relaxed">
          Know the accuracy <em>and</em> the price tag. 
        </p>
        <p className="text-md text-slate-500 leading-relaxed mb-6">
        We pair task performance scores from <a href="https://matbench-discovery.materialsproject.org/" className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700" target="_blank" rel="noopener noreferrer">MatBench Discovery</a> with Garden’s own throughput and cost benchmarks, run on the exact hardware and configuration your jobs will use. 
        That way, you get both an accuracy metric and a realistic cost baseline for planning production budgets, whether you’re using an HPC allocation or cloud credits.
        </p>
        <p className="text-md text-slate-500 leading-relaxed mb-6">
        We test each MLIP on <a href="https://matbench-discovery.materialsproject.org/data#--links-to-wbm-files" className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700" target="_blank" rel="noopener noreferrer">the WBM dataset</a> (median 22 atoms per structure) and report cost per 10,000 relaxations. 
        If your workloads involve larger systems, expect lower throughput and higher costs.
        </p>
      </div>
    </section>
  );
};
