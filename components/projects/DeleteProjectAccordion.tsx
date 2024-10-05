import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProject } from "@/hooks/projects";
import { useRouter } from "next/router";

export default function DeleteProject({ projectId }: { projectId: string }) {
  const { mutate, isPending: isDeleting } = useDeleteProject();
  const router = useRouter();
  const handleDelete = async () => {
    mutate(projectId, {
      onSuccess: () => {
        router.push(`/${router.query.workspaceSlug?.toString()}/projects`);
      },
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full ">
      <AccordionItem value="delete-project">
        <AccordionTrigger className="text-destructive hover:text-red-600">
          <span className="flex items-center">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Project
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Deleting this project will permanently remove all associated data,
              including files, settings, and collaboration information. This
              action cannot be undone.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
              <li>All project files will be deleted</li>
              <li>Collaborator access will be revoked</li>
              <li>Associated databases will be removed</li>
              <li>Deployment history will be erased</li>
            </ul>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="">
                  I understand, delete this project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your project and remove all associated data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete project"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
