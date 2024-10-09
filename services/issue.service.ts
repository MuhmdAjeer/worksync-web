import { CreateIssueDto } from "@/generated/dto/create-issue-dto";
import { APIService } from "./api.service";
import { IssueDto } from "@/generated/dto/issue-dto";
import { UpdateIssueDto } from "@/generated/dto/update-issue-dto";
import { IUpdateIssue } from "@/hooks/issue";
import { IssueFilterQuery } from "@/generated/dto/issue-filter-query";
import { AddCommentDto } from "@/generated/dto/add-comment-dto";
import { UpdateCommentDto } from "@/generated/dto/update-comment-dto";
import { Comment } from "@/generated/dto/comment";
import { CommentDto } from "@/generated/dto/comment-dto";

export class IssueService extends APIService {
  public async createIssue(
    projectId: string,
    data: CreateIssueDto,
  ): Promise<IssueDto> {
    return this.post(`project/${projectId}/issues`, data).then(
      (response) => response.data,
    );
  }

  public async fetchProjectIssues(
    projectId: string,
    params: IssueFilterQuery,
  ): Promise<{ data: IssueDto[] }> {
    return this.get(`project/${projectId}/issues`, params).then(
      (res) => res.data,
    );
  }

  public async updateIssue(data: IUpdateIssue): Promise<IssueDto[]> {
    return this.patch(
      `project/${data.projectId}/issues/${data.issueId}`,
      data,
    ).then((res) => res.data);
  }

  public async addComment({
    data,
    issueId,
  }: {
    issueId: string;
    data: AddCommentDto;
  }): Promise<IssueDto> {
    return this.post(`issue/${issueId}/comment`, data).then(
      (response) => response.data,
    );
  }

  public async editComment({
    data,
    issueId,
    commentId,
  }: {
    issueId: string;
    commentId: string;
    data: UpdateCommentDto;
  }): Promise<IssueDto> {
    return this.patch(`issue/${issueId}/comment/${commentId}`, data).then(
      (response) => response.data,
    );
  }

  public async getComments(issueId: string): Promise<CommentDto[]> {
    return this.get(`issue/${issueId}/comment`).then(
      (response) => response.data,
    );
  }
}
