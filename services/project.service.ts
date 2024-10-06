import { OnboardDto } from "@/generated/dto/onboard-dto";
import { APIService } from "./api.service";
import { Workspace } from "@/generated/dto/workspace";
import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { ProjectDto } from "@/generated/dto/project-dto";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";
import { ProjectMemberDto } from "@/generated/dto/project-member-dto";
import { MembersFilterQuery } from "@/generated/dto/members-filter-query";
import { AddMemberDto } from "@/generated/dto/add-member-dto";
import { UpdateProjectDto } from "@/generated/dto/update-project-dto";
import { AddLabelDto } from "@/generated/dto/add-label-dto";
import { Issue } from "@/generated/dto/issue";
import { IssueLabel } from "@/generated/dto/issue-label";
import { UpdateLabelDto } from "@/generated/dto/update-label-dto";

export class ProjectService extends APIService {
  constructor() {
    super();
  }

  public async createProject(
    workspaceSlug: string,
    data: CreateProjectDto,
  ): Promise<ProjectDto> {
    return this.post(`workspace/${workspaceSlug}/project`, data).then(
      (response) => response.data,
    );
  }

  public async fetchWorkspaceProjects(slug: string): Promise<ProjectDto[]> {
    console.log("im called");

    return this.get(`workspace/${slug}/projects`).then((res) => res.data);
  }

  public async fetchUserProjects(): Promise<ProjectDto[]> {
    return this.get(`/user/me/projects`).then((res) => res.data);
  }

  public async fetchProject(projectId: string): Promise<ProjectDto> {
    return this.get(`project/${projectId}`).then((res) => res.data);
  }

  public async updateProject(projectId: string, body: UpdateProjectDto) {
    return this.patch(`project/${projectId}`, body).then((res) => res.data);
  }

  public async fetchStates(projectId: string): Promise<IssueStateDto[]> {
    return this.get(`project/${projectId}/states`).then((res) => res.data);
  }

  public async addMembers(projectId: string, body: AddMemberDto) {
    return this.post(`project/${projectId}/members`, body).then(
      (res) => res.data,
    );
  }

  public async deleteProject(projectId: string) {
    return this.delete(`project/${projectId}/`).then((res) => res.data);
  }
  public async addLabel(projectId: string, body: AddLabelDto) {
    return this.post(`project/${projectId}/label`, body).then(
      (res) => res.data,
    );
  }

  public async getLabels(projectId: string): Promise<IssueLabel[]> {
    return this.get(`project/${projectId}/label`).then((res) => res.data);
  }
  public async updateLabel(
    { labelId, projectId }: { labelId: string; projectId: string },
    body: UpdateLabelDto,
  ) {
    return this.patch(`project/${projectId}/label/${labelId}`, body).then(
      (res) => res.data,
    );
  }
  public async deleteLabel({
    labelId,
    projectId,
  }: {
    labelId: string;
    projectId: string;
  }) {
    return this.delete(`project/${projectId}/label/${labelId}`).then(
      (res) => res.data,
    );
  }

  public async fetchMembers(
    projectId: string,
    params?: MembersFilterQuery,
  ): Promise<ProjectMemberDto[]> {
    return this.get(`project/${projectId}/members`, params).then(
      (res) => res.data,
    );
  }
}
