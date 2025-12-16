import React from "react";
import { Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/shadcn/button";

export const MatBenchInfoAlert = () => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                        <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-blue-900 mb-1">
                            MatBench Discovery Benchmark
                        </h3>
                        <p className="text-sm text-blue-800">
                            Evaluating AI models for accelerated materials discovery and crystal structure prediction
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-white/50 hover:bg-white/80"
                    >
                        <a
                            href="https://matbench-discovery.materialsproject.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                        >
                            Website
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-white/50 hover:bg-white/80"
                    >
                        <a
                            href="https://doi.org/10.1038/s41467-023-43490-1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                        >
                            Paper
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
};
