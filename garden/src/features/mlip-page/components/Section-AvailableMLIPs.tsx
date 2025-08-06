import { MLIPTable } from "./MLIPTable";
import { mockMLIPs } from "../data/mockMLIPs";

export const SectionAvailableMLIPs = () => {
  return (
    <section
      id="available-mlips"
      className="relative px-6 py-24 bg-gradient-to-br from-white via-slate-50/30 to-blue-50/50 text-slate-800 overflow-hidden"
    >
      {/* Background visual */}
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="mb-8 text-4xl font-serif font-bold tracking-tight text-slate-800">
          Available MLIPs
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mb-8 rounded-full" />

        <p className="text-lg md:text-xl text-slate-600 font-light max-w-4xl mb-10 leading-relaxed">
          The models below are pre-trained and production-ready—each benchmarked
          for accuracy, speed, and compatibility across simulation platforms.
        </p>

        <MLIPTable data={mockMLIPs} />
      </div>
    </section>
  );
};
