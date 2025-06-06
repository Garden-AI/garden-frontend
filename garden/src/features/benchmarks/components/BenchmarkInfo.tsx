import React from 'react';
import { ExternalLink, BookOpen, Target, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { MATBENCH_BENCHMARKS, isMatBenchDiscovery } from '../utils/matbench';

interface BenchmarkInfoProps {
  benchmarkName: string;
  description?: string;
  taskCount?: number;
  lastUpdated?: string;
}

export const BenchmarkInfo: React.FC<BenchmarkInfoProps> = ({
  benchmarkName,
  description,
  taskCount,
  lastUpdated,
}) => {
  const isMatBench = isMatBenchDiscovery(benchmarkName);
  const matbenchInfo = isMatBench ? MATBENCH_BENCHMARKS['matbench-discovery'] : null;

  const displayName = matbenchInfo?.name || benchmarkName;
  const displayDescription = matbenchInfo?.detailedDescription || description || 'No description available';
  const purpose = matbenchInfo?.purpose;
  const learnMoreUrl = matbenchInfo?.learnMoreUrl;

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {isMatBench && (
              <Badge variant="default" className="text-xs">
                Materials Science
              </Badge>
            )}
          </div>
          
          {purpose && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="italic">{purpose}</span>
            </div>
          )}
        </div>

        {learnMoreUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="flex items-center gap-1"
          >
            <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer">
              <BookOpen className="h-4 w-4" />
              Learn More
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </div>

      {/* Description Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            What This Benchmark Does
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            {displayDescription}
          </p>

          {isMatBench && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">
                Key Evaluation Areas:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Stability Prediction:</strong> Can the model identify which crystal structures will be stable?</li>
                <li>• <strong>Discovery Speed:</strong> How much faster can it find promising materials vs random search?</li>
                <li>• <strong>Structure Optimization:</strong> Can it predict the final stable shape of crystals?</li>
              </ul>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
            {taskCount && (
              <span>
                <strong>{taskCount}</strong> evaluation tasks
              </span>
            )}
            {lastUpdated && (
              <span>
                Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {isMatBench && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-1">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">
                Why This Matters for Materials Science
              </h4>
              <p className="text-sm text-green-800">
                Finding new materials traditionally takes decades of lab work. These AI models can 
                pre-screen millions of potential materials in days, helping scientists focus their 
                efforts on the most promising candidates for solar panels, batteries, and other technologies.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};