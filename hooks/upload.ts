import { FileUploadRequestDto } from "@/generated/dto/file-upload-request-dto";
import { QUERY_KEYS } from "@/lib/constants";
import { UploadService } from "@/services/upload.service";
import { useMutation, useQuery } from "@tanstack/react-query";

const uploadService = new UploadService();

type UploadParams = {
  fileDetails: FileUploadRequestDto;
  file: File;
};

export const useUpload = () => {
  return useMutation({
    mutationFn: async (data: UploadParams) =>
      await uploadService.uploadFile(data.fileDetails, data.file),
  });
};
