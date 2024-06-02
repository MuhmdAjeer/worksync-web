import { OnboardDto } from "@/generated/dto/onboard-dto";
import { APIService } from "./api.service";
import { Workspace } from "@/generated/dto/workspace";
import { Project } from "@/generated/dto/project";
import { CreateProjectDto } from "@/generated/dto/create-project-dto";

export class ProjectService extends APIService {
  constructor() {
    super();
  }

  public async createProject(data: CreateProjectDto): Promise<Project> {
    return this.post(`/project`, data).then((response) => response.data);
  }

  public async fetchProjects(workspaceId: string): Promise<Project[]> {
    return this.get(`workspace/${workspaceId}/projects`).then(
      (res) => res.data
    );
  }
}
