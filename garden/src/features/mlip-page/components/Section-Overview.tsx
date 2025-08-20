import { Link } from "react-router-dom";
import { CodeBlockMLIP } from "./MLIPCodeBlock";

export const SectionOverview = () => {
  return (
    <section
      aria-labelledby="mlip-heading"
      className="relative min-h-[50vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-800 overflow-hidden px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[60vw] h-[60vw] top-[-20%] left-[-10%] rounded-full bg-indigo-100 opacity-50 blur-3xl animate-pulse" />
        <div className="absolute w-[40vw] h-[40vw] bottom-[-20%] right-[-10%] rounded-full bg-blue-100 opacity-20 blur-2xl animate-pulse" />
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 to-transparent opacity-30 pointer-events-none rotate-[25deg]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="block lg:hidden">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <div className="w-1 h-32 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h1
                id="mlip-heading"
                className="font-serif font-bold text-slate-800 leading-[1.1] mb-6 text-4xl sm:text-5xl md:text-6xl transition-all duration-300"
              >
                <span className="block whitespace-nowrap">
                  Machine Learned
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                  Interatomic Potentials
                </span>
              </h1>

              <div className="space-y-4 mb-8">
                <p className="text-lg sm:text-xl md:text-2xl text-slate-700 font-light leading-relaxed">
                  Use Garden to run MLIP-driven atomistic simulation tasks like relaxation and structure prediction. We have the libraries and GPUs pre-configured. You just need an .xyz file and a few lines of Python.
                </p>

                <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl">
                  Run workloads on participating research computing facilities like
                  Argonne Leadership Computing Facility (ALCF) with{" "}
                  <a
                    href="http://globus-compute.readthedocs.io/en/stable/"
                    className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Globus Compute
                  </a>{" "}
                  or on the cloud with{" "}
                  <a
                    href="https://modal.com/"
                    className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Modal
                  </a>
                  .
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/garden/10.26311%2Fcexg-2349"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Run on the cloud
                </Link>
                <Link
                  to="/garden/mlip-garden"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Run on HPC
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <CodeBlockMLIP key="mobile" />
          </div>
        </div>

        <div className="hidden lg:flex items-start justify-between gap-8">
          <div className="flex flex-col items-center justify-center pl-2 pr-3 flex-shrink-0">
            <div className="w-1 h-64 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h1
              id="mlip-heading"
              className="font-serif font-bold text-slate-800 leading-[1.1] mb-6 text-[clamp(1.75rem,2.8vw,3.5rem)] xl:text-[clamp(2.25rem,3.2vw,4rem)] transition-all duration-150"
            >
              <span className="block whitespace-nowrap">
                Machine Learned
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                Interatomic Potentials
              </span>
            </h1>

            <div className="space-y-4 mb-8">
              <p className="text-[clamp(0.875rem,1.1vw,1.4rem)] text-slate-700 font-light leading-relaxed">
                Use Garden to run MLIP-driven atomistic simulation tasks like relaxation and structure prediction. We have the libraries and GPUs pre-configured. You just need an .xyz file and a few lines of Python.
              </p>

              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl">
                Run workloads on participating research computing facilities like
                Argonne Leadership Computing Facility (ALCF) with{" "}
                <a
                  href="http://globus-compute.readthedocs.io/en/stable/"
                  className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Globus Compute
                </a>{" "}
                or on the cloud with{" "}
                <a
                  href="https://modal.com/"
                  className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Modal
                </a>
                .
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/garden/10.26311%2Fcexg-2349"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Run on the cloud
              </Link>
              <Link
                to="/garden/mlip-garden"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Run on HPC
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0" style={{ minWidth: "500px" }}>
            <CodeBlockMLIP key="desktop" />
          </div>
        </div>
      </div>
    </section>
  );
};