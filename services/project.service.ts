import { OnboardDto } from "@/generated/dto/onboard-dto";
import { APIService } from "./api.service";
import { Workspace } from "@/generated/dto/workspace";
import { CreateProjectDto } from "@/generated/dto/create-project-dto";
import { ProjectDto } from "@/generated/dto/project-dto";
import { IssueStateDto } from "@/generated/dto/issue-state-dto";

export class ProjectService extends APIService {
  constructor() {
    super();
  }

  public async createProject(data: CreateProjectDto): Promise<ProjectDto> {
    return this.post(`/project`, data).then((response) => response.data);
  }

  public async fetchWorkspaceProjects(
    slug: string
  ): Promise<ProjectDto[]> {
    return this.get(`workspace/${slug}/projects`).then(
      (res) => res.data
    );
  }

  public async fetchStates(projectId: string): Promise<IssueStateDto[]> {
    return this.get(`project/${projectId}/issue-states`).then(
      (res) => res.data
    );
  }
}
