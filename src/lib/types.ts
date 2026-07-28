export type FolderItem = {
  id: string;
  name: string;
  parentId: string;
  path: string[];
  itemCount: number;
};

export type FileItem = {
  id: string;
  name: string;
  extension: string;
  size: string;
  author: string;
  category: string;
  folderId: string;
  description?: string | null;
  isFavorite: boolean;
  isShared: boolean;
  isPublic: boolean;
  createdAt: string;
  downloads?: number;
  views?: number;
  sharedWith?: string | null;
  isLocal?: boolean;
  uri?: string;
  mimeType?: string | null;
};

export interface Stats {
  totalFiles: number;
  totalFolders: number;
  totalUsers: number;
  totalDownloads: number;
  storageUsed: number;
  storageLimit: number;
}

export interface StoredData {
  folders: FolderItem[];
  files: FileItem[];
}
