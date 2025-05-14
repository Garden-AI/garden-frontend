export interface BenchmarkTask {
    id: number;
    function: {
        title?: string;
        function_name: string;
    };
}

export interface Benchmark {
    id: number;
    name: string;
    description: string;
    tasks?: BenchmarkTask[];
} 