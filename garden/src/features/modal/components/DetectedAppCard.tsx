import { FileCode, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModalFileMetadataResponse } from "@/types";

interface DetectedAppCardProps {
  metadata: ModalFileMetadataResponse;
}

export const DetectedAppCard = ({ metadata }: DetectedAppCardProps) => (
  <Card className="bg-gray-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileCode className="h-5 w-5" />
        Detected App Details
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div><span className="font-medium">App Name:</span> {metadata.app_name}</div>
      <div><span className="font-medium">Base Image:</span> {metadata.base_image_name}</div>
      
      <div>
        <div className="mb-2 font-medium">Functions:</div>
        <ScrollArea className="max-h-[180px] pr-3">
          <div className="flex flex-wrap gap-2">
            {metadata.modal_function_names.map((name: string, i: number) => (
              <Badge key={i} variant="outline" className="bg-white py-1">
                <Code className="mr-1 h-3 w-3" />
                {name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </CardContent>
  </Card>
); 