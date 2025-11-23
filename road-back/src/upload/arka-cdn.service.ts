import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface ArkaCDNUploadResponse {
  success: boolean;
  message: string;
  data: {
    fileId: string;
    arkivAddresses: string[];
    totalSize: number;
    originalSize: number;
    compressed: boolean;
    chunks: number;
    status: string;
    publicUrl: string;
  };
}

interface ArkaCDNPlainUploadResponse {
  success: boolean;
  message: string;
  data: {
    fileId: string;
    originalName: string;
    size: number;
    mimeType: string;
    status: string;
    message: string;
    publicUrl: string;
  };
}

interface ArkaCDNFileResponse {
  success: boolean;
  data: {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    userId: string;
    isDashVideo: boolean;
    createdAt: string;
    updatedAt: string;
    expiresAt: string | null;
    chunks: Array<{
      id: string;
      chunkIndex: number;
      arkivAddress: string;
      size: number;
      txHash: string;
    }>;
    publicUrl: string;
  };
}

interface ArkaCDNListResponse {
  success: boolean;
  data: Array<{
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    isDashVideo: boolean;
    createdAt: string;
    expiresAt: string | null;
    publicUrl: string;
  }>;
}

interface ArkaCDNTextResponse {
  success: boolean;
  data: {
    fileId: string;
    originalName: string;
    mimeType: string;
    size: number;
    content: string;
    encoding: string;
  };
}

interface ArkaCDNJsonResponse {
  success: boolean;
  data: {
    fileId: string;
    originalName: string;
    data: any;
  };
}

interface ArkaCDNStatusResponse {
  success: boolean;
  data: {
    fileId: string;
    status: string;
    progress: number;
    totalChunks: number;
    uploadedChunks: number;
    failedChunks: number;
    retryCount: number;
    lastError: string | null;
    chunks: Array<{
      chunkIndex: number;
      status: string;
      arkivAddress: string;
      txHash: string;
    }>;
  };
}

@Injectable()
export class ArkaCDNService {
  private readonly logger = new Logger(ArkaCDNService.name);
  private readonly baseUrl = 'https://arkacdn.openleague.pro/api';
  private accessToken: string | null = null;
  private readonly httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    // Create axios instance with browser-like headers to bypass Cloudflare
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
      withCredentials: true, // Enable cookie handling
    });

    // Add request interceptor to automatically include auth token
    this.httpClient.interceptors.request.use((config) => {
      if (this.accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  /**
   * Login to Arka CDN and get access token
   */
  async login(email: string, password: string): Promise<string> {
    try {
      this.logger.log(`Attempting to login to Arka CDN with email: ${email}`);

      const response = await this.httpClient.post('/auth/login', {
        email,
        password,
      });

      this.logger.debug(`Response status: ${response.status}, body: ${JSON.stringify(response.data)}`);

      if (!response.data.accessToken) {
        this.logger.error('No access token in response:', response.data);
        throw new BadRequestException('No access token received from Arka CDN');
      }

      this.accessToken = response.data.accessToken;
      this.logger.log('Successfully authenticated with Arka CDN');
      return this.accessToken;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle axios errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        this.logger.error(`Arka CDN login error (${status}):`, typeof data === 'string' ? data.substring(0, 200) : JSON.stringify(data));
        throw new BadRequestException(`Failed to login to Arka CDN (${status}): ${data?.message || 'Cloudflare protection or authentication failed'}`);
      }

      this.logger.error('Login error:', error.message || error);
      throw new BadRequestException(`Failed to authenticate with Arka CDN: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Login with wallet address
   */
  async loginWithWallet(walletAddress: string): Promise<string> {
    try {
      this.logger.log(`Attempting to login to Arka CDN with wallet: ${walletAddress}`);

      const response = await this.httpClient.post('/auth/login', {
        walletAddress,
      });

      this.logger.debug(`Response status: ${response.status}, body: ${JSON.stringify(response.data)}`);

      if (!response.data.accessToken) {
        this.logger.error('No access token in response:', response.data);
        throw new BadRequestException('No access token received from Arka CDN');
      }

      this.accessToken = response.data.accessToken;
      this.logger.log('Successfully authenticated with Arka CDN using wallet');
      return this.accessToken;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle axios errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        this.logger.error(`Arka CDN wallet login error (${status}):`, typeof data === 'string' ? data.substring(0, 200) : JSON.stringify(data));
        throw new BadRequestException(`Failed to login with wallet (${status}): ${data?.message || 'Cloudflare protection or authentication failed'}`);
      }

      this.logger.error('Wallet login error:', error.message || error);
      throw new BadRequestException(`Failed to authenticate with Arka CDN using wallet: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Set the access token manually
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Upload a file to Arka CDN
   */
  async uploadFile(
    file: Express.Multer.File,
    options?: {
      description?: string;
      compress?: boolean;
      enableDashStreaming?: boolean;
      ttl?: number;
    },
  ): Promise<ArkaCDNUploadResponse> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const formData = new FormData();

      // Convert Buffer to Uint8Array for Blob compatibility
      const uint8Array = new Uint8Array(file.buffer);
      const fileBlob = new Blob([uint8Array], { type: file.mimetype });
      formData.append('file', fileBlob, file.originalname);

      if (options?.description) {
        formData.append('description', options.description);
      }
      if (options?.compress !== undefined) {
        formData.append('compress', options.compress.toString());
      }
      if (options?.enableDashStreaming !== undefined) {
        formData.append('enableDashStreaming', options.enableDashStreaming.toString());
      }
      if (options?.ttl !== undefined) {
        formData.append('ttl', options.ttl.toString());
      }

      const response = await this.httpClient.post('/upload/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Upload file error:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to upload file to Arka CDN: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Upload plain text or JSON data
   */
  async uploadPlainData(
    data: string | object,
    filename: string,
    description?: string,
  ): Promise<ArkaCDNPlainUploadResponse> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const response = await this.httpClient.post('/upload/plain', {
        data,
        filename,
        description,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Upload plain data error:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to upload plain data to Arka CDN: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * List all files for the authenticated user
   */
  async listFiles(): Promise<ArkaCDNListResponse> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const response = await this.httpClient.get('/upload');
      return response.data;
    } catch (error) {
      this.logger.error('List files error:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to list files from Arka CDN: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get detailed information about a specific file
   */
  async getFile(fileId: string): Promise<ArkaCDNFileResponse> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException('File not found');
        }
        throw new BadRequestException('Failed to get file');
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Get file error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to get file from Arka CDN');
    }
  }

  /**
   * Get text content from a file
   */
  async getTextContent(fileId: string): Promise<ArkaCDNTextResponse> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/${fileId}/text`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException('File not found');
        }
        throw new BadRequestException('Failed to get text content');
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Get text content error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to get text content from Arka CDN');
    }
  }

  /**
   * Get parsed JSON content from a file
   */
  async getJsonContent(fileId: string): Promise<ArkaCDNJsonResponse> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/${fileId}/json`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException('File not found');
        }
        throw new BadRequestException('Failed to get JSON content');
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Get JSON content error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to get JSON content from Arka CDN');
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<{ success: boolean; message: string }> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException('File not found');
        }
        throw new BadRequestException('Failed to delete file');
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Delete file error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete file from Arka CDN');
    }
  }

  /**
   * Get file upload status
   */
  async getFileStatus(fileId: string): Promise<ArkaCDNStatusResponse> {
    if (!this.accessToken) {
      throw new BadRequestException('Not authenticated. Please login first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/${fileId}/status`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException('File not found');
        }
        throw new BadRequestException('Failed to get file status');
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Get file status error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to get file status from Arka CDN');
    }
  }

  /**
   * Get public URL for a file (no authentication required)
   */
  getPublicUrl(fileId: string): string {
    return `${this.baseUrl}/data/${fileId}`;
  }

  /**
   * Download file content directly (public endpoint)
   */
  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await fetch(this.getPublicUrl(fileId));

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException('File not found');
        }
        throw new BadRequestException('Failed to download file');
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      this.logger.error('Download file error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to download file from Arka CDN');
    }
  }
}
