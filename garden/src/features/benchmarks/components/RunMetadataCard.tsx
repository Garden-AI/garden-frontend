import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';
import {
    Cpu,
    Timer,
    DollarSign,
    Zap,
    Monitor
} from 'lucide-react';
import { RunMetadata } from '../types/benchmarks.types';

interface RunMetadataCardProps {
    metadata: RunMetadata;
    compact?: boolean;
}

const formatNumber = (num: number | undefined | null, decimals = 2): string => {
    if (num === undefined || num === null) return '—';
    return num.toFixed(decimals);
};

const formatDuration = (seconds: number | undefined): string => {
    if (seconds === undefined) return '—';
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(2)}h`;
};

const formatCurrency = (usd: number | undefined): string => {
    if (usd === undefined) return '—';
    return `$${usd.toFixed(4)}`;
};

const getDeviceIcon = (deviceType: string | undefined) => {
    switch (deviceType?.toLowerCase()) {
        case 'cuda':
            return '🎮';
        case 'mps':
            return '🍎';
        case 'cpu':
            return '💻';
        default:
            return '⚡';
    }
};

export const RunMetadataCard: React.FC<RunMetadataCardProps> = ({ metadata, compact = false }) => {
    const hasHardwareInfo = metadata.device_type || metadata.num_gpus || metadata.gpu_names;
    const hasTimingInfo = metadata.total_seconds !== undefined || metadata.throughput_per_second !== undefined;
    const hasCostInfo = metadata.estimated_cost_usd !== undefined || metadata.total_gpu_hours !== undefined;

    if (!hasHardwareInfo && !hasTimingInfo && !hasCostInfo) {
        return null;
    }

    if (compact) {
        return (
            <div className="flex flex-wrap gap-2 text-xs">
                {metadata.device_type && (
                    <Badge variant="outline" className="gap-1">
                        {getDeviceIcon(metadata.device_type)} {metadata.device_type.toUpperCase()}
                        {metadata.num_gpus && ` × ${metadata.num_gpus}`}
                    </Badge>
                )}
                {metadata.total_seconds !== undefined && (
                    <Badge variant="outline" className="gap-1">
                        <Timer className="h-3 w-3" /> {formatDuration(metadata.total_seconds)}
                    </Badge>
                )}
                {metadata.throughput_per_second !== undefined && (
                    <Badge variant="outline" className="gap-1">
                        <Zap className="h-3 w-3" /> {formatNumber(metadata.throughput_per_second, 3)}/s
                    </Badge>
                )}
                {metadata.estimated_cost_usd !== undefined && (
                    <Badge variant="secondary" className="gap-1">
                        <DollarSign className="h-3 w-3" /> {formatCurrency(metadata.estimated_cost_usd)}
                    </Badge>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hardware Card */}
            {hasHardwareInfo && (
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-blue-500" />
                            Hardware
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{getDeviceIcon(metadata.device_type)}</span>
                            <div>
                                <div className="font-semibold">
                                    {metadata.device_type?.toUpperCase() || 'Unknown'}
                                </div>
                                {metadata.num_gpus !== undefined && (
                                    <div className="text-xs text-muted-foreground">
                                        {metadata.num_gpus} GPU{metadata.num_gpus !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                        {metadata.gpu_names && metadata.gpu_names.length > 0 && (
                            <div className="text-xs text-muted-foreground truncate" title={metadata.gpu_names.join(', ')}>
                                {metadata.gpu_names[0]}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Performance Card */}
            {hasTimingInfo && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-green-500" />
                            Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {metadata.total_seconds !== undefined && (
                            <div>
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {formatDuration(metadata.total_seconds)}
                                </div>
                                <div className="text-xs text-muted-foreground">Total runtime</div>
                            </div>
                        )}
                        {metadata.throughput_per_second !== undefined && (
                            <div className="flex items-center gap-1 text-sm">
                                <span className="font-mono font-semibold">
                                    {formatNumber(metadata.throughput_per_second, 3)}
                                </span>
                                <span className="text-muted-foreground">structures/sec</span>
                            </div>
                        )}
                        {metadata.num_workers !== undefined && (
                            <div className="text-xs text-muted-foreground">
                                {metadata.num_workers} worker{metadata.num_workers !== 1 ? 's' : ''}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Cost Card */}
            {hasCostInfo && (
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900 dark:to-yellow-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-amber-500" />
                            Estimated Cost
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {metadata.estimated_cost_usd !== undefined && (
                            <div>
                                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                    {formatCurrency(metadata.estimated_cost_usd)}
                                </div>
                                <div className="text-xs text-muted-foreground">Total cost</div>
                            </div>
                        )}
                        {metadata.total_gpu_hours !== undefined && (
                            <div className="text-sm">
                                <span className="font-mono">{formatNumber(metadata.total_gpu_hours, 4)}</span>
                                <span className="text-muted-foreground"> GPU-hours</span>
                            </div>
                        )}
                        {metadata.estimated_cost_per_1000_structures_usd !== undefined && (
                            <div className="text-xs text-muted-foreground">
                                ${formatNumber(metadata.estimated_cost_per_1000_structures_usd, 2)} per 1K structures
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
    );
};

/**
 * Extract run metadata from a single transformed display item.
 */
export const extractRunMetadata = (item: Record<string, unknown>): RunMetadata => {
    return {
        model_name: item.model_name as string | undefined,
        device_type: item.device_type as string | undefined,
        num_gpus: item.num_gpus as number | undefined,
        total_seconds: item.total_seconds as number | undefined,
        throughput_per_second: item.throughput_per_second as number | undefined,
        // These need to be extracted from the original metrics blob if needed
    };
};

export default RunMetadataCard;
