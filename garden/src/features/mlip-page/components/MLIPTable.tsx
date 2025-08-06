import { MLIPTableRow } from "./types";

interface Props {
  data: MLIPTableRow[];
}

export const MLIPTable = ({ data }: Props) => {
  return (
    <div className="relative w-full overflow-x-auto rounded-xl border border-slate-200 bg-white/60 backdrop-blur-md shadow-lg">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-100/40 via-white/20 to-transparent pointer-events-none" />

      <table className="relative z-10 min-w-full text-sm">
        <thead className="bg-slate-100/80 text-slate-700 font-semibold uppercase tracking-wide text-xs">
          <tr>
            <th className="px-6 py-3 text-left">Model</th>
            <th className="px-6 py-3 text-left">Checkpoint</th>
            <th className="px-6 py-3 text-left">FPP</th>
            <th className="px-6 py-3 text-left">CPS</th>
            <th className="px-6 py-3 text-left">Cost ($/1k)</th>
            <th className="px-6 py-3 text-left">F1 Score</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={`${row.architecture}-${row.checkpoint}`}
              className={`border-t border-slate-200 transition-colors ${
                index % 2 === 0 ? "bg-white/60" : "bg-white/40"
              } hover:bg-indigo-50/30`}
            >
              <td className="px-6 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                {row.architecture}
              </td>

              <td className="px-6 py-2.5 text-slate-700">{row.checkpoint}</td>

              <td className="px-6 py-2.5 text-slate-700">{row.fpp}</td>

              <td className="px-6 py-2.5 font-semibold text-slate-800">
                {row.matbench.toFixed(3)}
              </td>

              <td className="px-6 py-2.5 text-slate-700">
                ${row.cost.toFixed(2)}
              </td>

              <td className="px-6 py-2.5 font-semibold text-slate-800">
                {row.score.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
