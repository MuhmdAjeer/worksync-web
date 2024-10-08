import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { observer } from "mobx-react";
import ProjectLogo from "./ProjectLogo";
import { useProject, useProjects } from "@/hooks/projects";
import { useRouter } from "next/router";
import { ScrollArea } from "../ui/scroll-area";

interface IProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

const ProjectsComboBox: React.FC<IProps> = observer(
  ({ onOpenChange, open, onChange, value, disabled }) => {
    const router = useRouter();
    const workspaceSlug = router.query.workspaceSlug?.toString();
    const { data: workspaceProjects } = useProjects(workspaceSlug!);
    const { data: selectedProject } = useProject(value);

    return (
      <Popover modal open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            disabled={disabled}
            aria-expanded={open}
            className="justify-between flex items-center gap-3"
          >
            {selectedProject && (
              <>
                <ProjectLogo value={selectedProject.logo} />
                <p>{selectedProject.name}</p>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 x-1000">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                <ScrollArea className="h-80 overflow-x-hidden">
                  {workspaceProjects?.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.id}
                      onSelect={(currentValue) => {
                        onChange(project.id);
                        onOpenChange(false);
                      }}
                      className="flex justify-between"
                    >
                      <span className="flex gap-2">
                        <ProjectLogo value={project.logo} />
                        {project.name}
                      </span>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProject?.name === project.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

export default ProjectsComboBox;
