export const SectionBenchmark = () => {
  const benchmarkMetrics = [
    {
      label: "Energy Accuracy",
      value: "< 1 meV/atom",
      description: "Mean absolute error across test sets",
    },
    {
      label: "Force Prediction",
      value: "< 0.1 eV/Å",
      description: "Root mean square error for atomic forces",
    },
    {
      label: "Training Efficiency",
      value: "10³ – 10⁶×",
      description: "Speed improvement over DFT calculations",
    },
    {
      label: "Transferability",
      value: "95%+",
      description: "Accuracy maintained across material systems",
    },
  ];

  return (
    <section
      id="benchmarking"
      className="relative overflow-hidden w-full px-6 py-24 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/40 text-slate-800"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#e2e8f0_1px,_transparent_1px)] [background-size:80px_80px] opacity-20 pointer-events-none" />
        <div className="absolute top-[20%] left-[10%] w-80 h-80 bg-gradient-to-br from-blue-100/30 to-slate-100/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-gradient-to-tr from-indigo-100/25 to-purple-100/20 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="mb-8 text-4xl font-serif font-bold tracking-tight text-slate-800">
          Benchmarking Results
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mb-10 rounded-full" />

        <p className="text-lg md:text-xl text-slate-600 max-w-4xl leading-relaxed mb-12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benchmarkMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/80 border border-slate-200/60 backdrop-blur-sm shadow-md hover:shadow-lg transition"
            >
              <div className="text-2xl font-bold text-slate-700 mb-1">
                {metric.value}
              </div>
              <div className="font-semibold text-slate-800">{metric.label}</div>
              <div className="text-sm text-slate-600 mt-1">{metric.description}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 shadow-md rounded-xl p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-slate-800 mb-4">
            Testing Framework
          </h3>
          <p className="text-md md:text-lg text-slate-600 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="text-md md:text-base text-slate-500 leading-relaxed">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </section>
  );
};
