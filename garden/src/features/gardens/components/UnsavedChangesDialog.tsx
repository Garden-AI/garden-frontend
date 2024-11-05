import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Blocker } from "react-router-dom";

interface UnsavedChangesDialogProps {
  blocker: Blocker;
}
export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  blocker,
}) => {
  const form = useFormContext();
  return (
    <AlertDialog
      open={blocker.state === "blocked"}
      onOpenChange={(isOpen) => {
        if (!isOpen && blocker.state === "blocked") {
          blocker.reset();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes that will be lost if you leave this page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={blocker.reset}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (blocker.proceed) {
                blocker.proceed();
                form.reset();
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
