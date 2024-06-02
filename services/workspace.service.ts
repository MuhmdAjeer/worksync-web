import { OnboardDto } from "@/generated/dto/onboard-dto";
import { APIService } from "./api.service";
import { Workspace } from "@/generated/dto/workspace";

export class WorkspaceService extends APIService {
  constructor() {
    super();
  }

  public async onboardUser(data: OnboardDto): Promise<Workspace> {
    return this.post(`/onboarding`, data).then((response) => response.data);
  }

  public async fetchMyWorkspaces(): Promise<Workspace[]> {
    return this.get("/workspace/me").then((response) => response.data);
  }
}
