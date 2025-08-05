import testImage from "../data/testimg.png";

export const SectionMLIPTasks = () => {
  return (
    <section
      id="mlip-tasks"
      className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-blue-50/50 text-slate-800 py-20 px-6"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[40vw] h-[40vw] top-[-10%] left-[-5%] rounded-full bg-indigo-100 opacity-20 blur-3xl" />
        <div className="absolute w-[30vw] h-[30vw] bottom-[-10%] right-[-5%] rounded-full bg-blue-100 opacity-15 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-serif font-bold tracking-tight mb-4 text-slate-800">
            Structure Relaxation
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-slate-600 font-light mb-4 leading-relaxed">
            Relaxation is the process of finding the most stable atomic configuration of a material.
          </p>
          <p className="text-md text-slate-500 leading-relaxed mb-6 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <a
            // href=""
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
          >
            See Available MLIPs
          </a>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-4">
            <img
              src={testImage}
              alt="Structure Relaxation Workflow"
              className="rounded-md max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
