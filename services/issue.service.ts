import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { APIService } from "./api.service";
import { IssueDto } from "@/generated/dto/issue-dto";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import { IUpdateIssue } from "@/hooks/issue";

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
    start?: number,
    fetchSize?: number
  ): Promise<IssueDto[]> {
    return this.get(`project/${projectId}/issues`, {
      page: start,
      pageSize: fetchSize,
    }).then((res) => res.data);
  }

  public async updateIssue(data: IUpdateIssue): Promise<IssueDto[]> {
    return this.patch(
      `project/${data.projectId}/issues/${data.issueId}`,
      data
    ).then((res) => res.data);
  }
}
