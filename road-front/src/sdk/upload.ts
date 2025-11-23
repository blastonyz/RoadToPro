import { AxiosInstance } from 'axios';
import { ApiResponseSuccess, UploadFileOptions, UploadedFileInfo } from './types';

export class UploadApi {
  constructor(private http: AxiosInstance) {}

  async uploadFile(file: File | Blob, options: UploadFileOptions = {}): Promise<ApiResponseSuccess<UploadedFileInfo>> {
    const form = new FormData();
    form.append('file', file);
    if (typeof options.description !== 'undefined') form.append('description', String(options.description));
    if (typeof options.compress !== 'undefined') form.append('compress', String(options.compress));
    if (typeof options.enableDashStreaming !== 'undefined') {
      form.append('enableDashStreaming', String(options.enableDashStreaming));
    }
    if (typeof options.ttl !== 'undefined') form.append('ttl', String(options.ttl));

    const { data } = await this.http.post<ApiResponseSuccess<UploadedFileInfo>>('/upload/file', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async uploadPlain(payload: Record<string, unknown>): Promise<ApiResponseSuccess<UploadedFileInfo>> {
    const { data } = await this.http.post<ApiResponseSuccess<UploadedFileInfo>>('/upload/plain', payload);
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getPublicUrl(arkaFileId: string): Promise<ApiResponseSuccess<any>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await this.http.get<ApiResponseSuccess<any>>(`/upload/${arkaFileId}`);
    return data.data.arkaFileId;
  }
}


