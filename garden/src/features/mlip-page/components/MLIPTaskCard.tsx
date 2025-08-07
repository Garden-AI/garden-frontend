interface Props {
  title: string;
  description: string;
  imageSrc: string;
  theme: "garden" | "polished" | "industrial";
}

export const MLIPTaskCard = ({ title, description, imageSrc, theme }: Props) => {
  return (
    <div className="relative bg-gradient-to-br from-white via-slate-50/50 to-blue-50 p-8 rounded-3xl shadow-2xl border border-slate-200/60 backdrop-blur-sm">
      <img
        src={imageSrc}
        alt={title}
        className="w-80 h-60 object-contain mx-auto mb-8 rounded-xl shadow-md"
      />
      <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif text-center">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed text-center mb-6 font-light">
        {description}
      </p>
      <div className="flex gap-3 justify-center">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition">
          On-demand
        </button>
        <button className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 transition">
          Batch
        </button>
      </div>
    </div>
  );
};
