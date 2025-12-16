import React from "react";
import { Info } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Card } from "@/components/shadcn/card";
import { cn } from "@/utils/form.utils";
import { inferMetricInfo, ENVIRONMENT_METRIC_KEYS } from "../utils/matbench";
import { METRIC_CATEGORY_THEMES } from "../utils/formatting";

interface MetricsExplanationProps {
    allMetricKeys: string[];
}

const MetricCard = ({ metricKey }: { metricKey: string }) => {
    const info = inferMetricInfo(metricKey);
    return (
        <Card className={cn(
            "p-4",
            METRIC_CATEGORY_THEMES[metricKey] || "",
            info.isPrimaryMetric && "border-primary/50 bg-primary/5"
        )}>
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-medium flex flex-wrap items-center gap-2 mr-2">
                        <span className="font-bold text-primary">{metricKey}</span>
                        <span className="text-muted-foreground">-</span>
                        <span>{info.name}</span>
                        {info.isPrimaryMetric && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded whitespace-nowrap">
                                Key Metric
                            </span>
                        )}
                    </h4>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {info.betterIs === 'higher' ? '↗️ Higher is better' : '↘️ Lower is better'}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    {info.description}
                </p>
                {info.unit && (
                    <div className="text-xs text-muted-foreground">
                        Unit: {info.unit}
                    </div>
                )}
            </div>
        </Card>
    );
};

export const MetricsExplanation = ({ allMetricKeys }: MetricsExplanationProps) => {
    if (allMetricKeys.length === 0) return null;

    return (
        <div className="mt-12 pt-8 border-t" id="metrics-info">
            <div className="flex items-center gap-2 mb-6">
                <Info className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Understanding the Metrics</h2>
            </div>

            <Accordion type="multiple" className="w-full">
                <AccordionItem value="performance" className="border-b-0 mb-4">
                    <AccordionTrigger className="hover:no-underline py-4 px-4 sm:px-6 bg-gray-50/80 hover:bg-gray-100 border rounded-lg mb-4 transition-all data-[state=open]:rounded-b-none data-[state=open]:mb-0 data-[state=open]:border-b-0">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📊</span>
                            <h3 className="text-lg font-medium">
                                Performance Metrics
                            </h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-x border-b rounded-b-lg px-4 sm:px-6 py-6 mt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                            These metrics measure how well a model predicts material stability and properties.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allMetricKeys.filter(key =>
                                !ENVIRONMENT_METRIC_KEYS.includes(key)
                            ).map(key => (
                                <MetricCard key={key} metricKey={key} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="environment" className="border-b-0">
                    <AccordionTrigger className="hover:no-underline py-4 px-4 sm:px-6 bg-gray-50/80 hover:bg-gray-100 border rounded-lg mb-4 transition-all data-[state=open]:rounded-b-none data-[state=open]:mb-0 data-[state=open]:border-b-0">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⚡</span>
                            <h3 className="text-lg font-medium">
                                Run Environment & Cost
                            </h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-x border-b rounded-b-lg px-4 sm:px-6 py-6 mt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                            These metrics help you compare the computational requirements and costs of running each model.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ENVIRONMENT_METRIC_KEYS.filter(key =>
                                ['device_type', 'num_gpus', 'total_seconds', 'throughput_per_second',
                                    'total_gpu_hours', 'estimated_cost_usd', 'estimated_cost_per_1000_structures_usd'].includes(key)
                            ).map(key => (
                                <MetricCard key={key} metricKey={key} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
