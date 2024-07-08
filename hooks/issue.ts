import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { IssueService } from "@/services/issue.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const issueService = new IssueService();

interface ICreateIssue extends CreateIssueDto {
  projectId: string;
}

export const useCreateIssue = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: ICreateIssue) =>
      await issueService.createIssue(data.projectId, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PROJECT_ISSUES] });
    },
  });
};
