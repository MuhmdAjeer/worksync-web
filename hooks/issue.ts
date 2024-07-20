import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { IssueDto } from "@/generated/dto/issue-dto";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { IssueService } from "@/services/issue.service";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const issueService = new IssueService();

interface ICreateIssue extends CreateIssueDto {
  projectId: string;
}
export interface IUpdateIssue extends UpdateIssueDto {
  projectId: string;
  issueId: string;
}

export const useProjectIssues = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_ISSUES, id],
    queryFn: async () => await issueService.fetchProjectIssues(id),
    enabled: !!id,
  });
};

export type PersonApiResponse = {
  data: IssueDto[];
  nextPage: number;
};

export const useInfiniteProjectIssues = (id: string, fetchSize: number) => {
  return useInfiniteQuery<PersonApiResponse>({
    queryKey: [QUERY_KEYS.GET_PROJECT_ISSUES, id],
    // @ts-ignore
    queryFn: async ({ pageParam = 0 }) => {
      const fetchedData = await issueService.fetchProjectIssues(
        id,
        pageParam as number,
        fetchSize
      );
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
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

export const useUpdateIssue = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: IUpdateIssue) =>
      await issueService.updateIssue(data),
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_ISSUES],
      });
    },
    onError: () => {
      toast.error("Failed to update issue");
    },
  });
};
