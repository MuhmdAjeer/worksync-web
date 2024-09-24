import { OnboardDto } from "@/generated/dto/onboard-dto";
import { APIService } from "./api.service";
import { WorkspaceDto } from "@/generated/dto/workspace-dto";
import { CreateWorkspaceDto } from "@/generated/dto/create-workspace-dto";
import { InviteMembersDto } from "@/generated/dto/invite-members-dto";
import { WorkspaceMemberDto } from "@/generated/dto/workspace-member-dto";
import { InvitationDto } from "@/generated/dto/invitation-dto";
import { InvitationQuery } from "@/generated/dto/invitation-query";
import { UpdateInvitationDto } from "@/generated/dto/update-invitation-dto";
import { MembersFilterQuery } from "@/generated/dto/members-filter-query";

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

  public async createWorkspace(data: CreateWorkspaceDto) {
    return this.post("/workspace", data).then((res) => res.data);
  }

  public async inviteMembers(slug: string, data: InviteMembersDto) {
    return this.post(`/workspace/${slug}/invitations`, data).then((res) => res);
  }

  public async getMembers(
    slug: string,
    params?: MembersFilterQuery,
  ): Promise<WorkspaceMemberDto[]> {
    return this.get(`/workspace/${slug}/members`, params).then(
      (res) => res.data,
    );
  }

  public async getInvitations(
    slug: string,
    query: InvitationQuery,
  ): Promise<InvitationDto[]> {
    return this.get(`workspace/${slug}/invitations`, query).then(
      (res) => res.data,
    );
  }

  public async updateInvitatioon(
    id: string,
    slug: string,
    body: UpdateInvitationDto,
  ) {
    return this.patch(`workspace/${slug}/invitation/${id}`, body).then(
      (res) => res.data,
    );
  }

  public async removeInvitation(id: string, slug: string) {
    return this.delete(`workspace/${slug}/invitation/${id}`).then(
      (res) => res.data,
    );
  }
}
