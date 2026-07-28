import AsyncStorage from '@react-native-async-storage/async-storage';
import { FileItem, FolderItem, Stats, StoredData } from './types';

const STORAGE_KEY = 'e-library-data-v2';
const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_API_URL is not configured');
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`API error (${response.status})`);
  return response.status === 204 ? (undefined as T) : response.json();
}

async function getLocalData(): Promise<StoredData | null> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

async function saveLocalData(data: StoredData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// PostgreSQL via the Python API is the primary source. AsyncStorage keeps the app usable offline.
export async function getStoredData(): Promise<StoredData> {
  try {
    const remote = await request<StoredData>('/api/library');
    if (remote.folders.length || remote.files.length) {
      await saveLocalData(remote);
      return remote;
    }

    const local = await getLocalData();
    return local ?? { folders: [], files: [] };
  } catch (error) {
    console.warn('API indisponible : utilisation du cache local.', error);
    const local = await getLocalData();
    return local ?? { folders: [], files: [] };
  }
}

export async function getStats(): Promise<Stats> {
  try {
    return await request<Stats>('/api/stats');
  } catch (error) {
    console.warn('Impossible de récupérer les statistiques, utilisation des données locales.', error);
    const local = await getLocalData();
    if (!local) {
      return {
        totalFiles: 0,
        totalFolders: 0,
        totalUsers: 0,
        totalDownloads: 0,
        storageUsed: 0,
        storageLimit: 15,
      };
    }

    // Calculer l'espace utilisé à partir des fichiers locaux si l'API est indisponible.
    const parseSizeToBytes = (size?: string | null): number => {
      if (!size) return 0;
      const s = size.trim();
      // gérer "Taille inconnue" ou formats inattendus
      const match = s.match(/([\d.,]+)\s*(o|b|ko|kb|mo|mb|go|gb)?/i);
      if (!match) return 0;
      const num = parseFloat(match[1].replace(',', '.')) || 0;
      const unit = (match[2] || '').toLowerCase();
      switch (unit) {
        case 'o':
        case 'b':
          return num;
        case 'ko':
        case 'kb':
          return num * 1024;
        case 'mo':
        case 'mb':
          return num * 1024 ** 2;
        case 'go':
        case 'gb':
          return num * 1024 ** 3;
        default:
          // si pas d'unité, on suppose octets
          return num;
      }
    };

    const totalBytes = local.files.reduce((acc, f) => acc + parseSizeToBytes((f as any).size), 0);
    const storageUsedGb = parseFloat((totalBytes / (1024 ** 3)).toFixed(1));

    return {
      totalFiles: local.files.length,
      totalFolders: local.folders.length,
      totalUsers: 0,
      totalDownloads: 0,
      storageUsed: storageUsedGb,
      storageLimit: 15,
    };
  }
}

export async function saveData(data: StoredData): Promise<void> {
  await saveLocalData(data);
}

export async function saveFile(file: FileItem): Promise<void> {
  try {
    await request('/api/files', { method: 'POST', body: JSON.stringify(file) });
  } catch (error) {
    console.warn('Fichier enregistrÃ© localement, synchronisation diffÃ©rÃ©e.', error);
  }
  const data = await getLocalData() ?? { folders: [], files: [] };
  data.files.push(file);
  await saveLocalData(data);
}

export async function saveFolder(folder: FolderItem): Promise<void> {
  try {
    await request('/api/folders', { method: 'POST', body: JSON.stringify(folder) });
  } catch (error) {
    console.warn('Dossier enregistré localement, synchronisation différée.', error);
  }
  const data: StoredData = await getLocalData() ?? { folders: [], files: [] };
  data.folders.push(folder);
  await saveLocalData(data);
}

export async function deleteStoredFile(id: string): Promise<void> {
  try {
    await request(`/api/files/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.warn('Suppression conservÃ©e localement, API indisponible.', error);
  }
  const data = await getStoredData();
  data.files = data.files.filter((file) => file.id !== id);
  await saveLocalData(data);
}

export async function deleteStoredFolder(id: string): Promise<void> {
  try {
    await request(`/api/folders/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.warn('Suppression conservÃ©e localement, API indisponible.', error);
  }
  const data = await getStoredData();
  const removed = new Set<string>([id]);
  let hasNewChildren = true;
  while (hasNewChildren) {
    hasNewChildren = false;
    data.folders.forEach((folder) => {
      if (removed.has(folder.parentId) && !removed.has(folder.id)) {
        removed.add(folder.id);
        hasNewChildren = true;
      }
    });
  }
  data.folders = data.folders.filter((folder) => !removed.has(folder.id));
  data.files = data.files.filter((file) => !removed.has(file.folderId));
  await saveLocalData(data);
}

export async function renameStoredFolder(id: string, name: string): Promise<void> {
  const cleanName = name.trim();
  if (!cleanName) return;
  try {
    await request(`/api/folders/${id}`, { method: 'PATCH', body: JSON.stringify({ name: cleanName }) });
  } catch (error) {
    console.warn('Renommage conservé localement, API indisponible.', error);
  }
  const data = await getLocalData() ?? { folders: [], files: [] };
  const folder = data.folders.find((item) => item.id === id);
  if (!folder) return;
  const previousPath = folder.path;
  const nextPath = [...previousPath.slice(0, -1), cleanName];
  data.folders.forEach((item) => {
    const belongsToFolder = previousPath.every((segment, index) => item.path[index] === segment);
    if (belongsToFolder) item.path = [...nextPath, ...item.path.slice(previousPath.length)];
  });
  folder.name = cleanName;
  await saveLocalData(data);
}

async function updateFileFlag(id: string, field: 'isFavorite' | 'isShared' | 'isPublic'): Promise<void> {
  const data = await getStoredData();
  const file = data.files.find((item) => item.id === id);
  if (!file) return;
  const value = !file[field];
  try {
    await request(`/api/files/${id}`, { method: 'PATCH', body: JSON.stringify({ [field]: value }) });
  } catch (error) {
    console.warn('Modification conservÃ©e localement, API indisponible.', error);
  }
  file[field] = value;
  await saveLocalData(data);
}

export const toggleFavoriteStored = (id: string) => updateFileFlag(id, 'isFavorite');
export const toggleShareStored = (id: string) => updateFileFlag(id, 'isShared');
export const togglePublicStored = (id: string) => updateFileFlag(id, 'isPublic');
