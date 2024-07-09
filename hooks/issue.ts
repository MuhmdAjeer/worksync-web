import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { IssueService } from "@/services/issue.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const issueService = new IssueService();

interface ICreateIssue extends CreateIssueDto {
  projectId: string;
}

export const useProjectIssues = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_ISSUES, id],
    queryFn: async () => await issueService.fetchProjectIssues(id),
    enabled: !!id,
  });
};

export const useCreateIssue = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: ICreateIssue) =>
      await issueService.createIssue(data.projectId, data),
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_ISSUES],
      });
    },
    onError: () => {
      toast.error("Failed to create issue");
    },
  });
};
