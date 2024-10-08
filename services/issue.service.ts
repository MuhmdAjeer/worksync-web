import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { APIService } from "./api.service";
import { IssueDto } from "@/generated/dto/issue-dto";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import { IUpdateIssue } from "@/hooks/issue";
import { IssueFilterQuery } from "@/generated/dto/issue-filter-query";

export class IssueService extends APIService {
  public async createIssue(
    projectId: string,
    data: CreateIssueDto
  ): Promise<IssueDto> {
    return this.post(`project/${projectId}/issues`, data).then(
      (response) => response.data
    );
  }

  public async fetchProjectIssues(
    projectId: string,
    params: IssueFilterQuery
  ): Promise<{ data: IssueDto[] }> {
    return this.get(`project/${projectId}/issues`, params).then(
      (res) => res.data
    );
  }

  public async updateIssue(data: IUpdateIssue): Promise<IssueDto[]> {
    return this.patch(
      `project/${data.projectId}/issues/${data.issueId}`,
      data
    ).then((res) => res.data);
  }
}
