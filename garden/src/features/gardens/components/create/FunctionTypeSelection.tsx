import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Cloud, Server } from "lucide-react";

/**
 * Function type selection component for garden creation flow
 * Allows users to choose between Modal Functions or HPC Functions
 */
export const FunctionTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Create a Garden</h1>
        <p className="text-lg text-muted-foreground">
          Choose the type of function you'd like to add to your garden
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modal Functions Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-blue-50">
                <Cloud className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Modal Functions</CardTitle>
            </div>
            <CardDescription className="text-base">
              Deploy serverless Python functions using Modal's cloud infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate("/garden/create?deploy=modal-app")}
            >
              Use Modal Functions
            </Button>
          </CardContent>
        </Card>

        {/* HPC Functions Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-green-50">
                <Server className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">HPC Functions</CardTitle>
            </div>
            <CardDescription className="text-base">
              Run functions on HPC clusters using Globus Compute
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate("/garden/create?deploy=hpc-function")}
            >
              Use HPC Functions
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Not sure which to choose?{" "}
          <a
            href="https://garden-ai.readthedocs.io/en/latest/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Read the documentation
          </a>
        </p>
      </div>
    </div>
  );
};
