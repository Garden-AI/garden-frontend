import { SectionOverview } from "./components/Section-Overview";
import { SectionMLIPTasks } from "./components/Section-MLIPTasks";
import { SectionAvailableMLIPs } from "./components/Section-AvailableMLIPs";
import { SectionBenchmark } from "./components/Section-Benchmark";

export default function MLIPPage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <SectionOverview />
        <SectionAvailableMLIPs />
        <SectionMLIPTasks />
        <SectionBenchmark />
      </main>
    </div>
  );
}

