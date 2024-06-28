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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Project } from "@/generated/dto/project";
import { observer } from "mobx-react";
import { useProject } from "@/hooks/project";
import { CommandList } from "cmdk";
import ProjectLogo from "./ProjectLogo";

interface IProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onChange: (value: string) => void;
  value?: string;
}

const ProjectsComboBox: React.FC<IProps> = observer(
  ({ onOpenChange, open, onChange, value }) => {
    const { getProjectById, workspaceProjects } = useProject();
    const selectedProject = value ? getProjectById(value) : null;

    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
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
                {workspaceProjects.map((project) => (
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
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

export default ProjectsComboBox;
