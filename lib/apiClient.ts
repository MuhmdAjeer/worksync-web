import axios, { getAdapter, type AxiosInstance, AxiosError } from "axios";
import { CreateUserDto } from "@/generated/dto/create-user-dto";
import { VerifyOTPDto } from "@/generated/dto/verify-otpdto";
import { SendOTPDto } from "@/generated/dto/send-otpdto";
import { OnboardDto } from "@/generated/dto/onboard-dto";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import { FileUploadRequestDto } from "@/generated/dto/file-upload-request-dto";
import { FileUploadResponseDto } from "@/generated/FileUploadResponseDto";
import { Workspace } from "@/generated/dto/workspace";

export interface ApiAuthProvider {
  getToken: () => Promise<string | undefined>;
  onAuthError: (err: Error) => void | Promise<void>;
}

export interface LoginResponse extends User {
  access_token: string;
}

export class ApiClient {
  private readonly http: AxiosInstance;

  constructor(
    private readonly baseURL = "http://localhost:5000/api",
    private readonly authProvider: ApiAuthProvider
  ) {
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 200000,
    });
    this.http.interceptors.request.use(async (config: any) => {
      const session = await getSession();
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${session?.access_token}`,
      };
      return config;
    });
    this.http.interceptors.response.use(
      (ok) => ok,
      async (err: AxiosError) => {
        if (Boolean(err.isAxiosError) && err.response?.status === 401) {
          await this.authProvider.onAuthError(err);
        }
        throw err;
      }
    );
  }

  public async registerUser(userDto: CreateUserDto): Promise<CreateUserDto> {
    return (await this.http.post<CreateUserDto>("/auth/register", userDto))
      .data;
  }

  public async verifyToken(data: VerifyOTPDto): Promise<void> {
    return (await this.http.post(`/auth/verify/otp`, data)).data;
  }
  public async login(data: CreateUserDto): Promise<LoginResponse> {
    return (await this.http.post<{ access_token: string }>(`/auth/login`, data))
      .data;
  }
  public async resendCode(data: SendOTPDto): Promise<void> {
    return (await this.http.post(`/auth/verify/otp/send`, data)).data;
  }
  public async onboardUser(data: OnboardDto): Promise<Workspace> {
    return (await this.http.post(`/onboarding`, data)).data;
  }
  public async getCurrentUser(): Promise<User> {
    return (await this.http.get(`/auth/currentUser`)).data;
  }
  private async getUploadParams(
    requestBody: FileUploadRequestDto
  ): Promise<FileUploadResponseDto> {
    return (await this.http.post("/upload", requestBody)).data;
  }

  public async uploadFile(
    fileDetails: FileUploadRequestDto,
    file: File
  ): Promise<string> {
    const params = await this.getUploadParams(fileDetails);
    const formData = new FormData();
    for (const k of Object.keys(params.fields)) {
      formData.append(k, (params.fields as any)[k]);
    }
    formData.append("file", file);
    await axios.post(params.url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return params.public_url;
  }
}
const client = new ApiClient(undefined, {
  getToken: async (): Promise<string | undefined> => "$32423",
  async onAuthError(): Promise<void> {
    // localStorage.clear();
    // window.location.href = "/auth/register";
  },
});

export default client;

export interface MyUser {
  id: string;
  name: string;
  email: string;
  image: string;
}
