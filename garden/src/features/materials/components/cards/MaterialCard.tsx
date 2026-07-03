import React, { useState } from 'react';
import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { MaterialModalContext } from '../modals/MaterialModal';

// Re-export MaterialModalContext as MaterialContext for backward compatibility
export type MaterialContext = MaterialModalContext;

export interface BaseMaterialCardProps {
  material: any;
  materialType: 'paper' | 'dataset' | 'repository' | 'notebook';
  isOwner: boolean;
  context: MaterialContext;
  icon: ReactNode;
  title: string;
  onEdit: () => void;
  onEditClick: () => void;
  children: ReactNode;
}

export const BaseMaterialCard = ({
  material,
  materialType,
  isOwner,
  icon,
  title,
  onEdit,
  onEditClick,
  children
}: BaseMaterialCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const materialLink = material?.url || (material?.doi ? `https://doi.org/${material.doi}` : undefined);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onEdit();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card className="rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md overflow-hidden group backdrop-blur-sm bg-white">
        <CardHeader className="pt-5 pb-2 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="text-teal bg-teal/10 p-2 rounded-lg flex-shrink-0">
              {icon}
            </div>
            <CardTitle className="font-medium text-lg text-gray-800 tracking-tight">
              {materialLink ? (
                <a 
                  href={materialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline transition-colors"
                >
                  {title}
                </a>
              ) : (
                <span>{title}</span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-2 text-sm">
          <div className="text-gray-700">
            {children}
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end">
          {isOwner && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 hover:text-teal hover:bg-teal/10 transition-colors h-7 px-2 rounded-md"
                onClick={onEditClick}
                aria-label={`Edit ${materialType}`}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors h-7 px-2 rounded-md"
                onClick={handleDelete}
                aria-label={`Remove ${materialType}`}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {materialType}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this {materialType} from the function? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 