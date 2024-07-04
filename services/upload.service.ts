import { FileUploadRequestDto } from "@/generated/dto/file-upload-request-dto";
import { APIService } from "./api.service";
import { FileUploadResponseDto } from "@/generated/dto/file-upload-response-dto";
import axios from "axios";

export class UploadService extends APIService {
  private async getUploadParams(
    requestBody: FileUploadRequestDto
  ): Promise<FileUploadResponseDto> {
    return (await this.post("/upload", requestBody)).data;
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
