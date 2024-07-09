import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { APIService } from "./api.service";
import { IssueDto } from "@/generated/dto/issue-dto";

export class IssueService extends APIService {
  public async createIssue(
    projectId: string,
    data: CreateIssueDto
  ): Promise<IssueDto> {
    return this.post(`project/${projectId}/issues`, data).then(
      (response) => response.data
    );
  }

  public async fetchProjectIssues(projectId: string): Promise<IssueDto[]> {
    return this.get(`project/${projectId}/issues`).then((res) => res.data);
  }
}
