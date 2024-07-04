import { UserDto } from "@/generated/dto/user-dto";
import { APIService } from "./api.service";
import { InvitationDto } from "@/generated/dto/invitation-dto";

export class UserService extends APIService {
  public async getCurrentUser(): Promise<UserDto> {
    return this.get("/user/me").then((res) => res.data);
  }

  public async getInvitations(): Promise<InvitationDto[]> {
    return this.get("/user/invitations").then((res) => res.data);
  }

  public async updateProfile(data: Partial<UserDto>): Promise<UserDto> {
    return this.patch("/user/me", data).then((res) => res.data);
  }
}
