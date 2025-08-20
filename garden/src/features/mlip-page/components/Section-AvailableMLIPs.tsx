import { MLIPTable } from "./MLIPTable";
import { mockMLIPs } from "../data/mockMLIPs";

export const SectionAvailableMLIPs = () => {
  return (
    <section
      id="available-mlips"
      className="relative px-4 sm:px-6 lg:px-8 py-14 md:py-20 bg-gradient-to-br from-white via-slate-50/30 to-blue-50/50 text-slate-800 overflow-visible"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[50vw] h-[50vw] top-[-15%] left-[-10%] rounded-full bg-indigo-100 opacity-30 blur-3xl" />
        <div className="absolute w-[35vw] h-[35vw] bottom-[-10%] right-[-5%] rounded-full bg-blue-100 opacity-20 blur-2xl" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_auto] lg:gap-10 items-start">
        <div className="order-2 lg:order-1">
          <MLIPTable data={mockMLIPs} />
        </div>

        <aside className="order-1 lg:order-2 lg:text-right mb-10 lg:mb-0 lg:mt-0">
          <h2 className="mb-4 text-3xl sm:text-4xl font-serif font-bold tracking-tight text-slate-800">
            Available MLIPs
          </h2>
          <div className="hidden lg:block w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mb-8 rounded-full ml-auto" />

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-light max-w-lg lg:max-w-sm lg:ml-auto mb-6 leading-relaxed">
            These models have been configured for high throughput batch relaxation with{" "}
            <a
              href="https://radical-ai.github.io/torch-sim/"
              className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-sm"
              aria-label="Learn more about TorchSim (opens in a new tab)"
              target="_blank"
              rel="noopener noreferrer"
            >
              TorchSim
            </a>
            .
          </p>
        </aside>
      </div>
    </section>
  );
};
