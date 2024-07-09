import { OnboardDto } from "@/generated/dto/onboard-dto";
import { APIService } from "./api.service";
import { Workspace } from "@/generated/dto/workspace";
import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { ProjectDto } from "@/generated/dto/project-dto";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";
import { ProjectMemberDto } from "@/generated/dto/project-member-dto";

export class ProjectService extends APIService {
  constructor() {
    super();
  }

  public async createProject(
    workspaceSlug: string,
    data: CreateProjectDto
  ): Promise<ProjectDto> {
    return this.post(`workspace/${workspaceSlug}/project`, data).then(
      (response) => response.data
    );
  }

  public async fetchWorkspaceProjects(slug: string): Promise<ProjectDto[]> {
    console.log("im called");

    return this.get(`workspace/${slug}/projects`).then((res) => res.data);
  }

  public async fetchProject(projectId: string): Promise<ProjectDto> {
    return this.get(`project/${projectId}`).then((res) => res.data);
  }

  public async fetchStates(projectId: string): Promise<IssueStateDto[]> {
    return this.get(`project/${projectId}/states`).then((res) => res.data);
  }

  public async fetchMembers(projectId: string): Promise<ProjectMemberDto[]> {
    return this.get(`project/${projectId}/members`).then((res) => res.data);
  }
}
