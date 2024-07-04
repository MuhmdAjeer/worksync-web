import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { ProjectService } from "@/services/project.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const projectService = new ProjectService();

export const useProjects = (workspaceSlug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_WORKSPACE_PROJECTS, workspaceSlug],
    queryFn: async () =>
      await projectService.fetchWorkspaceProjects(workspaceSlug),
    enabled: !!workspaceSlug,
  });
};

export const useCreateProject = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug,
      project,
    }: {
      slug: string;
      project: CreateProjectDto;
    }) => await projectService.createProject(slug, project),
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_WORKSPACE_PROJECTS],
      });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
};
