import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/shadcn/select";
import { Plus } from "lucide-react";

export type Benchmark = {
    id: number | string;
    name: string;
};

const CREATE_NEW_BENCHMARK = "create_new";

interface BenchmarkSelectorProps {
    benchmarks: Benchmark[];
    selectedBenchmarkId: number | string;
    onSelectBenchmark: (benchmarkId: number | string) => void;
    onCreateNew: () => void;
    className?: string;
}

export const BenchmarkSelector: React.FC<BenchmarkSelectorProps> = ({
    benchmarks,
    selectedBenchmarkId,
    onSelectBenchmark,
    onCreateNew,
    className
}) => {
    const handleValueChange = (value: string) => {
        if (value === CREATE_NEW_BENCHMARK) {
            onCreateNew();
            return;
        }

        // Find the benchmark with this ID
        const selectedBenchmark = benchmarks.find(b =>
            String(b.id) === value
        );

        if (selectedBenchmark) {
            onSelectBenchmark(selectedBenchmark.id);
        }
    };

    return (
        <div className={className}>
            <Select
                value={String(selectedBenchmarkId)}
                onValueChange={handleValueChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select benchmark" />
                </SelectTrigger>
                <SelectContent>
                    {benchmarks.map(benchmark => (
                        <SelectItem
                            key={benchmark.id}
                            value={String(benchmark.id)}
                        >
                            {benchmark.name}
                        </SelectItem>
                    ))}
                    <SelectItem
                        key={CREATE_NEW_BENCHMARK}
                        value={CREATE_NEW_BENCHMARK}
                        className="text-green-600 font-medium"
                    >
                        <div className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Create New Benchmark
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}; 