import { UserDto } from "@/generated/dto/user-dto";
import { APIService } from "./api.service";
import { CreateUserDto } from "@/generated/dto/create-user-dto";
import { VerifyOTPDto } from "@/generated/dto/verify-otpdto";
import { SendOTPDto } from "@/generated/dto/send-otpdto";

export interface LoginResponse extends UserDto {
  access_token: string;
}

export class AuthService extends APIService {
  public async registerUser(userDto: CreateUserDto): Promise<CreateUserDto> {
    return (await this.post("/auth/register", userDto)).data;
  }

  public async verifyToken(data: VerifyOTPDto): Promise<void> {
    return (await this.post(`/auth/verify/otp`, data)).data;
  }
  public async login(data: CreateUserDto): Promise<LoginResponse> {
    return (await this.post(`/auth/login`, data)).data;
  }
  public async resendCode(data: SendOTPDto): Promise<void> {
    return (await this.post(`/auth/verify/otp/send`, data)).data;
  }

  public async getCurrentUser(): Promise<UserDto> {
    return (await this.get(`/auth/currentUser`)).data;
  }
}
