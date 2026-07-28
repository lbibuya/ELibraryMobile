import { FileItem } from './types';

export type ResourceType = 'documents' | 'images' | 'videos' | 'audio' | 'archives' | 'other';

const extensions: Record<Exclude<ResourceType, 'other'>, string[]> = {
  documents: ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'md', 'csv', 'xls', 'xlsx', 'ods', 'ppt', 'pptx', 'odp', 'epub'],
  images: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic', 'svg', 'bmp', 'tiff'],
  videos: ['mp4', 'avi', 'mkv', 'mov', 'webm', 'm4v', '3gp'],
  audio: ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac', 'wma'],
  archives: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
};

export function getResourceType(extension: string): ResourceType {
  const normalized = extension.toLowerCase().replace(/^\./, '');
  return (Object.keys(extensions) as Exclude<ResourceType, 'other'>[]).find((type) => extensions[type].includes(normalized)) ?? 'other';
}

export function isResourceInView(file: FileItem, view: Exclude<ResourceType, 'other'>): boolean {
  return getResourceType(file.extension) === view;
}

export function categoryForType(type: ResourceType): string {
  return { documents: 'Documents', images: 'Images', videos: 'Vidéos', audio: 'Audio', archives: 'Archives', other: 'Autres fichiers' }[type];
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes < 1) return 'Taille inconnue';
  const units = ['o', 'Ko', 'Mo', 'Go'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
}
