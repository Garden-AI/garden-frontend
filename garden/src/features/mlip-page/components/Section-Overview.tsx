import MLIPCodeSnippet from "./code-snippet/MLIPCodeSnippet";
import { Link } from "react-router-dom";

export const SectionOverview = () => {
  return (
    <section className="relative min-h-[50vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-800 overflow-hidden px-6 md:px-12 py-16 md:py-20">

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

      {/* Centered content container so backgrounds remain full-width while content aligns */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="hidden md:flex flex-col items-center justify-center pl-6 pr-4">
          <div className="w-1 h-64 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
        </div>

        <div className="w-full md:w-1/2 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 leading-tight mb-6">
            <div>Machine Learned</div>
            <span className="whitespace-nowrap bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Interatomic Potentials
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 font-light leading-relaxed mb-3">
            Use Garden to run MLIP-driven atomistic simulation tasks like relaxation and structure prediction.
            We have the libraries and GPUs pre-configured. You just need an .xyz file and a few lines of Python.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md">
            Run workloads on participating research computing facilities like Argonne Leadership Computing Facility (ALCF) with <a href="http://globus-compute.readthedocs.io/en/stable/" className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700" target="_blank" rel="noopener noreferrer">Globus Compute</a> or on the cloud with <a href="https://modal.com/" className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700" target="_blank" rel="noopener noreferrer">Modal</a>.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/garden/10.26311%2Fcexg-2349"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              Run on the cloud
            </Link>
            <Link
              to="/garden/mlip-garden"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              Run on HPC
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <MLIPCodeSnippet />
        </div>
      </div>
    </section>
  );
};
