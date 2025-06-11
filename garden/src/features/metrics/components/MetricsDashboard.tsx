import React from "react";
import { useGetMetrics } from "../api/useGetMetrics";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { BarChart3, Zap, Database, FileText, Archive, Eye } from "lucide-react";

const MetricsDashboard: React.FC = () => {
  const { data: metrics, isLoading, isError } = useGetMetrics();

  if (isLoading) return <LoadingOverlay />;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Platform Metrics</h1>
          <p className="text-red-600">Error loading metrics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Garden Metrics</h1>
        <p className="text-gray-600">Statistics and usage data for the Gardens platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="All Gardens"
          value={metrics?.allGardens ?? 0}
          description="All gardens (draft, published, archived)"
          icon={<Database className="h-6 w-6" />}
          iconColor="text-slate-600"
          bgColor="bg-slate-50"
        />

        <MetricCard
          title="Published Gardens"
          value={metrics?.publishedGardens ?? 0}
          description="Gardens with published DOIs"
          icon={<Eye className="h-6 w-6" />}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />

        <MetricCard
          title="Draft Gardens"
          value={metrics?.draftGardens ?? 0}
          description="Gardens in development"
          icon={<FileText className="h-6 w-6" />}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Archived Gardens"
          value={metrics?.archivedGardens ?? 0}
          description="Archived gardens"
          icon={<Archive className="h-6 w-6" />}
          iconColor="text-gray-600"
          bgColor="bg-gray-50"
        />

        <MetricCard
          title="Total Functions"
          value={metrics?.totalFunctions ?? 0}
          description="Functions in published gardens"
          icon={<BarChart3 className="h-6 w-6" />}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />

        <MetricCard
          title="Total Invocations"
          value={metrics?.totalInvocations ?? 0}
          description="Function invocations to date"
          icon={<Zap className="h-6 w-6" />}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This dashboard is currently only accessible to superusers for administrative purposes.
        </p>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, iconColor, bgColor }) => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${bgColor}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <CardDescription className="text-xs text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default MetricsDashboard;