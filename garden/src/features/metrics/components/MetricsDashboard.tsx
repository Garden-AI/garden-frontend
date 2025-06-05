import React from "react";
import { useGetMetrics } from "../api/useGetMetrics";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { BarChart3, Zap, Database } from "lucide-react";

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Metrics</h1>
        <p className="text-gray-600">Statistics and usage data for the Gardens platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Gardens"
          value={metrics?.totalGardens ?? 0}
          description="Published research gardens"
          icon={<Database className="h-6 w-6" />}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />

        <MetricCard
          title="Total Functions"
          value={metrics?.totalFunctions ?? 0}
          description="Modal functions across all gardens"
          icon={<BarChart3 className="h-6 w-6" />}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />

        <MetricCard
          title="Total Invocations"
          value={metrics?.totalInvocations ?? 0}
          description="Function executions to date"
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