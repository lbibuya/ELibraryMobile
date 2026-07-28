import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Archive, FileText, Image, Music, Video } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileItem, FolderItem, Stats } from '../lib/types';
import {
  getStoredData,
  getStats,
  saveData,
  saveFile,
  saveFolder,
  deleteStoredFile,
  deleteStoredFolder,
  renameStoredFolder,
  toggleFavoriteStored,
  toggleShareStored,
  togglePublicStored,
} from '../lib/storage';
import { Header } from '../components/Header';
import { ShareResourcesModal } from '../components/ShareResourcesModal';
import { BOTTOM_TAB_BAR_HEIGHT, BottomTabBar, TabView } from '../components/BottomTabBar';
import { DrawerMenu, LibraryView } from '../components/DrawerMenu';
import { CreateFolderModal } from '../components/CreateFolderModal';
import { AddFileModal } from '../components/AddFileModal';
import { DashboardScreen } from './DashboardScreen';
import { FileExplorerScreen } from './FileExplorerScreen';
import { SharedAccessScreen } from './SharedAccessScreen';
import { colors } from '../lib/colors';
import { categoryForType, formatFileSize, getResourceType, isResourceInView } from '../lib/resourceTypes';

interface DriveInterfaceProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export function DriveInterface({ user, onLogout }: DriveInterfaceProps) {
  const insets = useSafeAreaInsets();
  type AppView = TabView | LibraryView;

  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [libraryView, setLibraryView] = useState<LibraryView | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalFiles: 0,
    totalFolders: 0,
    totalUsers: 0,
    totalDownloads: 0,
    storageUsed: 0,
    storageLimit: 15,
  });
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderBeingEdited, setFolderBeingEdited] = useState<FolderItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Chargement des données persistées et des statistiques live
  useEffect(() => {
    (async () => {
      const data = await getStoredData();
      setFolders(data.folders);
      setFiles(data.files);

      try {
        const remoteStats = await getStats();
        setStats(remoteStats);
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    })();
  }, []);

  const currentFolder = folders.find((f) => f.id === currentFolderId) || null;
  const breadcrumb = currentFolder ? currentFolder.path : [];

  const favoriteFiles = useMemo(() => files.filter((f) => f.isFavorite), [files]);
  const recentFiles = useMemo(
    () => [...files].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [files]
  );

  const activeView: AppView = libraryView ?? activeTab;

  const foldersWithCounts = useMemo(() => folders.map((folder) => ({
    ...folder,
    itemCount: folders.filter((child) => child.parentId === folder.id).length + files.filter((file) => file.folderId === folder.id).length,
  })), [folders, files]);

  const displayFolders = useMemo(() => {
    if (!['library', 'documents', 'images', 'videos', 'audio', 'archives'].includes(activeView)) return [];
    return foldersWithCounts.filter((f) => f.parentId === currentFolderId);
  }, [activeView, currentFolderId, foldersWithCounts]);

  const displayFiles = useMemo(() => {
    if (activeView === 'favorites') return favoriteFiles;
    if (activeView === 'recent') return recentFiles;
    if (['documents', 'images', 'videos', 'audio', 'archives'].includes(activeView)) {
      return files.filter((f) => isResourceInView(f, activeView as LibraryView) && (currentFolderId === 'root' || f.folderId === currentFolderId));
    }
    if (activeView === 'library') return files.filter((f) => f.folderId === currentFolderId);
    return [];
  }, [activeView, currentFolderId, favoriteFiles, recentFiles, files]);

  const q = searchQuery.toLowerCase().trim();
  const filteredFolders = q ? displayFolders.filter((f) => f.name.toLowerCase().includes(q)) : displayFolders;
  const filteredFiles = q
    ? displayFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.author.toLowerCase().includes(q) ||
          f.extension.toLowerCase().includes(q)
      )
    : displayFiles;

  const handleTabChange = (tab: TabView) => {
    setActiveTab(tab);
    setLibraryView(null);
    setCurrentFolderId('root');
    setSearchQuery('');
  };

  const handleLibraryViewChange = (view: LibraryView) => {
    setLibraryView(view);
    setActiveTab('library');
    setCurrentFolderId('root');
    setSearchQuery('');
  };

  const openCategoryFolderCreation = (view: LibraryView) => {
    handleLibraryViewChange(view);
    setIsCreateFolderOpen(true);
  };

  const toggleFavorite = useCallback(async (id: string) => {
    await toggleFavoriteStored(id);
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)));
  }, []);

  const toggleShare = useCallback(async (id: string) => {
    await toggleShareStored(id);
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isShared: !f.isShared } : f)));
  }, []);

  const togglePublic = useCallback(async (id: string) => {
    await togglePublicStored(id);
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, isPublic: !f.isPublic } : f)));
  }, []);

  const deleteFile = useCallback(async (id: string) => {
    await deleteStoredFile(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const deleteFolder = useCallback(async (id: string) => {
    await deleteStoredFolder(id);
    const removed = new Set<string>([id]);
    folders.forEach((folder) => {
      if (removed.has(folder.parentId)) removed.add(folder.id);
    });
    let hasNewChildren = true;
    while (hasNewChildren) {
      hasNewChildren = false;
      folders.forEach((folder) => {
        if (removed.has(folder.parentId) && !removed.has(folder.id)) { removed.add(folder.id); hasNewChildren = true; }
      });
    }
    setFolders((prev) => prev.filter((folder) => !removed.has(folder.id)));
    setFiles((prev) => prev.filter((file) => !removed.has(file.folderId)));
    if (removed.has(currentFolderId)) setCurrentFolderId('root');
  }, [currentFolderId, folders]);

  const renameFolder = useCallback(async (id: string, name: string) => {
    await renameStoredFolder(id, name);
    setFolders((prev) => prev.map((folder) => folder.id === id ? { ...folder, name } : folder));
    setFolderBeingEdited(null);
  }, []);

  const handleCreateFolder = useCallback(async (name: string) => {
    const newId = `folder-${Date.now()}`;
    const parentPath = currentFolder ? currentFolder.path : [];
    const newPath = [...parentPath, name];
    const newFolder: FolderItem = {
      id: newId,
      name,
      parentId: currentFolderId,
      path: newPath,
      itemCount: 0,
    };
    await saveFolder(newFolder);
    setFolders((prev) => [...prev, newFolder]);
    setIsCreateFolderOpen(false);
  }, [currentFolder, currentFolderId]);

  const handleAddFile = useCallback(async (fileName: string, category: string, extension: string) => {
    const newId = `file-${Date.now()}`;
    const newFile: FileItem = {
      id: newId,
      name: fileName,
      description: 'Fichier ajouté manuellement',
      author: user.name,
      category,
      folderId: currentFolderId,
      extension,
      size: '0 KB',
      downloads: 0,
      views: 0,
      isFavorite: false,
      isShared: false,
      isPublic: false,
      sharedWith: null,
      createdAt: new Date().toISOString(),
      isLocal: true,
    } as any;
    await saveFile(newFile);
    setFiles((prev) => [...prev, newFile]);
    setIsUploadOpen(false);
  }, [user.name, currentFolderId]);

  const handleImportFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      const extension = asset.name.includes('.') ? asset.name.split('.').pop()!.toLowerCase() : 'file';
      const resourceType = getResourceType(extension);
      const selectedView = resourceType;
      const newFile: FileItem = {
        id: `file-${Date.now()}`,
        name: asset.name,
        description: 'Fichier importé depuis cet appareil',
        author: user.name,
        category: selectedView === 'images' ? 'Galerie' : selectedView === 'videos' ? 'Vidéos' : 'Fichiers',
        folderId: currentFolderId,
        extension,
        size: formatFileSize(asset.size),
        downloads: 0,
        views: 0,
        isFavorite: false,
        isShared: false,
        isPublic: false,
        sharedWith: null,
        createdAt: new Date().toISOString(),
        isLocal: true,
        uri: asset.uri,
        mimeType: asset.mimeType,
      } as any;
      newFile.category = categoryForType(resourceType);
      await saveFile(newFile);
      setFiles((previous) => [...previous, newFile]);
      Alert.alert('Import terminé', `${asset.name} a été ajouté à LeviCloud.`);
    } catch (error) {
      Alert.alert('Import impossible', 'Le fichier n’a pas pu être ajouté. Vérifiez les autorisations de fichiers.');
    }
  }, [currentFolderId, user.name]);

  const handleDownloadFile = useCallback(async (file: FileItem) => {
    const localUri = (file as any).uri as string | undefined;
    try {
      if (Platform.OS === 'web') {
        const content = JSON.stringify(file, null, 2);
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
        link.href = objectUrl;
        link.download = `${file.name}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        return;
      }

      const uri = localUri || `${FileSystem.cacheDirectory}${file.name.replace(/[^a-z0-9._-]/gi, '_')}.txt`;
      if (!localUri) {
        await FileSystem.writeAsStringAsync(uri, `LeviCloud\n\n${file.name}\n${(file as any).description || ''}`, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: `Enregistrer ${file.name}` });
      } else {
        Alert.alert('Téléchargement indisponible', 'Votre appareil ne permet pas encore d’enregistrer ce fichier.');
      }
    } catch (error) {
      Alert.alert('Téléchargement impossible', 'Ce fichier ne peut pas être enregistré pour le moment.');
    }
  }, []);

  const handleDownloadCategory = useCallback(async (view: LibraryView) => {
    const exportName = `levicloud-${view}-${new Date().toISOString().slice(0, 10)}.json`;
    const content = JSON.stringify({ application: 'LeviCloud', exportedAt: new Date().toISOString(), files: files.filter((file) => isResourceInView(file, view)) }, null, 2);

    try {
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
        link.href = objectUrl;
        link.download = exportName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        return;
      }

      const uri = `${FileSystem.cacheDirectory}${exportName}`;
      await FileSystem.writeAsStringAsync(uri, content, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { dialogTitle: 'Enregistrer l’export LeviCloud' });
      }
    } catch (error) {
      Alert.alert('Export impossible', 'La sélection ne peut pas être enregistrée pour le moment.');
    }
  }, [files]);

  const viewTitles: Record<string, string> = {
    dashboard: 'Tableau de bord',
    library: 'Ma Bibliothèque',
    favorites: 'Mes Favoris',
    recent: 'Fichiers Récents',
    shared: 'Accès Partagés',
    documents: 'Tous les Documents',
    images: 'Toutes les Images',
    videos: 'Toutes les Vidéos',
    audio: 'Tous les Fichiers Audio',
    archives: 'Toutes les Archives',
  };

  const showSearch = activeView !== 'dashboard' && activeView !== 'shared';

  const libraryShortcuts: { id: LibraryView; label: string; caption: string; Icon: typeof FileText }[] = [
    { id: 'audio', label: 'Audio', caption: 'Musique et enregistrements', Icon: Music },
    { id: 'archives', label: 'Archives', caption: 'ZIP, RAR et autres', Icon: Archive },
    { id: 'images', label: 'Galerie', caption: 'Photos et images', Icon: Image },
    { id: 'videos', label: 'Vidéos', caption: 'Films et clips', Icon: Video },
    { id: 'documents', label: 'Fichiers', caption: 'Documents classés', Icon: FileText },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={viewTitles[activeView] || 'LeviCloud'}
        user={user}
        isOnline={isOnline}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={showSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onLogout={onLogout}
        showMenu={true}
        onMenuToggle={() => setIsDrawerOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      <View style={[styles.content, { paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 8 }]}>
        {activeView === 'dashboard' && (
          <DashboardScreen stats={stats} recentFiles={recentFiles.slice(0, 6)} />
        )}
        {activeView === 'shared' && (
          <SharedAccessScreen files={files} onToggleShare={toggleShare} />
        )}
        {activeView !== 'dashboard' && activeView !== 'shared' && (
          <>
            {activeView === 'library' && currentFolderId === 'root' && (
              <View style={styles.shortcuts}>
                <Text style={styles.shortcutsTitle}>ACCÈS RAPIDE</Text>
                <View style={styles.shortcutsRow}>
                  {libraryShortcuts.map(({ id, label, caption, Icon }) => {
                    const isActive = false;
                    return (
                      <View key={id} style={[styles.shortcut, isActive && styles.shortcutActive]}>
                        <TouchableOpacity onPress={() => handleLibraryViewChange(id)} activeOpacity={0.8}>
                          <View style={[styles.shortcutIcon, isActive && styles.shortcutIconActive]}>
                            <Icon size={20} color={isActive ? colors.white : colors.teal[600]} />
                          </View>
                          <Text style={[styles.shortcutLabel, isActive && styles.shortcutLabelActive]}>{label}</Text>
                          <Text style={styles.shortcutCaption} numberOfLines={1}>{caption}</Text>
                        </TouchableOpacity>
                        {false && <View style={styles.shortcutActions}>
                          <TouchableOpacity style={styles.shortcutAction} onPress={() => handleLibraryViewChange(id)}>
                            <Text style={styles.shortcutActionText}>Ouvrir</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.shortcutAction} onPress={() => openCategoryFolderCreation(id)}>
                            <Text style={styles.shortcutActionText}>Nouveau dossier</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.shortcutAction} onPress={() => handleDownloadCategory(id)}>
                            <Text style={styles.shortcutActionText}>Télécharger</Text>
                          </TouchableOpacity>
                        </View>}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            {activeView !== 'library' && <FileExplorerScreen
            folders={filteredFolders}
            files={filteredFiles}
            searchQuery={searchQuery}
            onFolderClick={setCurrentFolderId}
            onBack={() => {
              if (currentFolder && currentFolder.parentId) {
                setCurrentFolderId(currentFolder.parentId);
              } else {
                setCurrentFolderId('root');
                setLibraryView(null);
              }
            }}
            canGoBack={activeTab === 'library' && (currentFolderId !== 'root' || libraryView !== null)}
            showBack={activeTab === 'library'}
            onToggleFavorite={toggleFavorite}
            onToggleShare={toggleShare}
            onTogglePrivacy={togglePublic}
            onDeleteFile={deleteFile}
            onDeleteFolder={deleteFolder}
            onRenameFolder={(folder) => setFolderBeingEdited(folder)}
            onOpenCreateFolder={() => setIsCreateFolderOpen(true)}
            onOpenUpload={handleImportFile}
            onDownloadCategory={() => handleDownloadCategory(activeView as LibraryView)}
            onDownloadFile={handleDownloadFile}
            showActions={['documents', 'images', 'videos', 'audio', 'archives'].includes(activeView)}
            />}
          </>
        )}
      </View>

      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <DrawerMenu
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeView={activeView}
        onViewChange={handleLibraryViewChange}
        stats={stats}
      />

      <CreateFolderModal
        visible={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onCreate={handleCreateFolder}
      />

      <CreateFolderModal
        visible={!!folderBeingEdited}
        initialName={folderBeingEdited?.name}
        title="Renommer le dossier"
        submitLabel="Enregistrer"
        onClose={() => setFolderBeingEdited(null)}
        onCreate={(name) => { if (folderBeingEdited) renameFolder(folderBeingEdited.id, name); }}
      />

      <AddFileModal
        visible={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAdd={handleAddFile}
        userName={user.name}
      />

      <ShareResourcesModal visible={isShareOpen} onClose={() => setIsShareOpen(false)} files={files} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[100],
  },
  content: {
    flex: 1,
  },
  shortcuts: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  shortcutsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate[400],
    letterSpacing: 1,
    marginBottom: 10,
  },
  shortcutsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shortcut: {
    width: '31%',
    minWidth: 0,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  shortcutActive: {
    borderColor: colors.teal[500],
    backgroundColor: colors.teal[50],
  },
  shortcutIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.teal[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shortcutIconActive: {
    backgroundColor: colors.teal[600],
  },
  shortcutLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate[700],
  },
  shortcutLabelActive: {
    color: colors.teal[700],
  },
  shortcutCaption: {
    marginTop: 2,
    fontSize: 10,
    color: colors.slate[400],
  },
  shortcutActions: {
    marginTop: 8,
    gap: 5,
  },
  shortcutAction: {
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.slate[100],
    alignItems: 'center',
  },
  shortcutActionText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.teal[700],
  },
});
