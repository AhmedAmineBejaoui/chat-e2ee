import { configContext } from './configContext';
import { IUploadFileResponse, IUploadMultipleResponse } from './public/types';

const getBaseURL = (): string => {
  const { apiURL } = configContext();
  const BASE_URI = apiURL || (process.env.NODE_ENV === 'production' ? 'https://chat-e2ee-2.azurewebsites.net' : '');
  return BASE_URI;
};

/**
 * Upload a single file to the server
 */
export const uploadFile = async (file: File): Promise<IUploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${getBaseURL()}/api/files/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }

    return {
      success: true,
      file: data.file,
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Upload multiple files to the server (max 10)
 */
export const uploadFiles = async (files: File[]): Promise<IUploadMultipleResponse> => {
  if (files.length === 0) {
    return { success: false, error: 'No files provided' };
  }

  if (files.length > 10) {
    return { success: false, error: 'Maximum 10 files allowed' };
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch(`${getBaseURL()}/api/files/upload-multiple`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }

    return {
      success: true,
      files: data.files,
      count: data.count,
    };
  } catch (error) {
    console.error('Files upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Get supported file types and limits
 */
export const getSupportedFileTypes = async (): Promise<{
  maxFileSize: number;
  maxFileSizeFormatted: string;
  categories: Record<string, string[]>;
} | null> => {
  try {
    const response = await fetch(`${getBaseURL()}/api/files/supported-types`);
    const data = await response.json();
    
    if (data.success) {
      return {
        maxFileSize: data.maxFileSize,
        maxFileSizeFormatted: data.maxFileSizeFormatted,
        categories: data.categories,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching supported types:', error);
    return null;
  }
};

/**
 * Utility to check if a file type is supported
 */
export const isFileTypeSupported = (mimetype: string, supportedTypes: Record<string, string[]>): boolean => {
  const allTypes = Object.values(supportedTypes).flat();
  return allTypes.includes(mimetype);
};

/**
 * Get file category from mimetype
 */
export const getFileCategory = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.includes('pdf') || mimetype.includes('document') || mimetype.includes('word') || 
      mimetype.includes('excel') || mimetype.includes('powerpoint') || mimetype.includes('text/')) {
    return 'document';
  }
  if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('7z') || 
      mimetype.includes('tar') || mimetype.includes('gzip')) {
    return 'archive';
  }
  if (mimetype.includes('json') || mimetype.includes('xml') || mimetype.includes('javascript') || 
      mimetype.includes('css') || mimetype.includes('html')) {
    return 'code';
  }
  return 'other';
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
