import { OnboardDto } from "@/generated/dto/onboard-dto";
import { APIService } from "./api.service";
import { WorkspaceDto } from "@/generated/dto/workspace-dto";

export class WorkspaceService extends APIService {
  constructor() {
    super();
  }

  public async onboardUser(data: OnboardDto): Promise<WorkspaceDto> {
    return this.post(`/onboarding`, data).then((response) => response.data);
  }

  public async fetchMyWorkspaces(): Promise<WorkspaceDto[]> {
    return this.get("/workspace/me").then((response) => response.data);
  }

  public async fetchWorkspace(slug: string): Promise<WorkspaceDto> {
    return this.get(`/workspace/${slug}`).then((res) => res.data);
  }
}
