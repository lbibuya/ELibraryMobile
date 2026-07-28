export const mockData = {
  stats: {
    totalFiles: 24,
    totalFolders: 8,
    totalUsers: 12,
    totalDownloads: 156,
    storageUsed: 4.2,
    storageLimit: 15.0,
  },
  folders: [
    { id: "folder-1", name: "Informatique", parentId: "root", path: ["Informatique"], itemCount: 3 },
    { id: "folder-2", name: "Développement Web", parentId: "folder-1", path: ["Informatique", "Développement Web"], itemCount: 5 },
    { id: "folder-3", name: "Intelligence Artificielle", parentId: "folder-1", path: ["Informatique", "Intelligence Artificielle"], itemCount: 2 },
    { id: "folder-4", name: "Médecine", parentId: "root", path: ["Médecine"], itemCount: 4 },
    { id: "folder-5", name: "Droit", parentId: "root", path: ["Droit"], itemCount: 1 },
  ],
  files: [
    { id: "file-1", name: "Guide React.pdf", extension: "pdf", size: "2.4 MB", author: "Admin", category: "Informatique", folderId: "folder-2", isFavorite: true, isShared: true, isPublic: true, createdAt: "2023-10-15T10:00:00Z" },
    { id: "file-2", name: "Cours TypeScript.pdf", extension: "pdf", size: "1.8 MB", author: "Admin", category: "Informatique", folderId: "folder-2", isFavorite: false, isShared: false, isPublic: false, createdAt: "2023-10-16T11:30:00Z" },
    { id: "file-3", name: "Schema BDD.png", extension: "png", size: "450 KB", author: "Admin", category: "Informatique", folderId: "folder-2", isFavorite: true, isShared: false, isPublic: true, createdAt: "2023-10-17T09:15:00Z" },
    { id: "file-4", name: "Présentation IA.pptx", extension: "pptx", size: "5.1 MB", author: "Admin", category: "Informatique", folderId: "folder-3", isFavorite: false, isShared: true, isPublic: false, createdAt: "2023-10-18T14:20:00Z" },
    { id: "file-5", name: "Anatomie.pdf", extension: "pdf", size: "8.2 MB", author: "Admin", category: "Médecine", folderId: "folder-4", isFavorite: true, isShared: false, isPublic: true, createdAt: "2023-10-19T08:45:00Z" },
    { id: "file-6", name: "Code Civil.pdf", extension: "pdf", size: "3.5 MB", author: "Admin", category: "Droit", folderId: "folder-5", isFavorite: false, isShared: false, isPublic: false, createdAt: "2023-10-20T16:00:00Z" },
    { id: "file-7", name: "Tutoriel Video.mp4", extension: "mp4", size: "45.2 MB", author: "Admin", category: "Informatique", folderId: "folder-2", isFavorite: false, isShared: true, isPublic: true, createdAt: "2023-10-21T13:30:00Z" },
    { id: "file-8", name: "Audio Cours.mp3", extension: "mp3", size: "12.4 MB", author: "Admin", category: "Médecine", folderId: "folder-4", isFavorite: true, isShared: false, isPublic: false, createdAt: "2023-10-22T10:10:00Z" },
  ],
};

export type FileItem = {
  id: string;
  name: string;
  extension: string;
  size: string;
  author: string;
  category: string;
  folderId: string;
  isFavorite: boolean;
  isShared: boolean;
  isPublic: boolean;
  createdAt: string;
  isLocal?: boolean;
  uri?: string;
  mimeType?: string | null;
};

export type FolderItem = {
  id: string;
  name: string;
  parentId: string;
  path: string[];
  itemCount: number;
};
