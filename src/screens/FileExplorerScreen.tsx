import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  Folder,
  Star,
  Share2,
  Trash2,
  MoreVertical,
  ArrowLeft,
  FolderPlus,
  Globe,
  Lock,
  X,
  Check,
  Download,
  Pencil,
} from 'lucide-react-native';
import { FileItem, FolderItem } from '../lib/types';
import { FileIcon } from '../components/FileIcon';
import { colors } from '../lib/colors';

interface FileExplorerScreenProps {
  folders: FolderItem[];
  files: FileItem[];
  searchQuery: string;
  onFolderClick: (id: string) => void;
  onBack: () => void;
  canGoBack: boolean;
  showBack: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleShare: (id: string) => void;
  onTogglePrivacy: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (folder: FolderItem) => void;
  onOpenCreateFolder: () => void;
  onOpenUpload: () => void;
  onDownloadCategory?: () => void;
  onDownloadFile: (file: FileItem) => void;
  showActions: boolean;
}

export function FileExplorerScreen({
  folders,
  files,
  searchQuery,
  onFolderClick,
  onBack,
  canGoBack,
  showBack,
  onToggleFavorite,
  onToggleShare,
  onTogglePrivacy,
  onDeleteFile,
  onDeleteFolder,
  onRenameFolder,
  onOpenCreateFolder,
  onOpenUpload,
  onDownloadCategory,
  onDownloadFile,
  showActions,
}: FileExplorerScreenProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [folderMenuOpen, setFolderMenuOpen] = useState<string | null>(null);

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Supprimer le fichier',
      `Voulez-vous vraiment supprimer "${name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => { onDeleteFile(id); setMenuOpen(null); } },
      ]
    );
  };

  const confirmDeleteFolder = (id: string, name: string) => {
    Alert.alert('Supprimer le dossier', `Supprimer "${name}" et son contenu ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDeleteFolder(id) },
    ]);
  };

  if (folders.length === 0 && files.length === 0 && !searchQuery) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Folder size={32} color={colors.slate[400]} />
        </View>
        <Text style={styles.emptyTitle}>Cet espace est vide</Text>
        <Text style={styles.emptyDesc}>
          Commencez par créer un dossier ou importer des fichiers pour organiser votre bibliothèque.
        </Text>
        {showActions && (
          <View style={styles.emptyActions}>
            <TouchableOpacity style={styles.outlineButton} onPress={onOpenCreateFolder}>
              <FolderPlus size={16} color={colors.slate[600]} />
              <Text style={styles.outlineButtonText}>Nouveau dossier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={onOpenUpload}>
              <Text style={styles.primaryButtonText}>Importer</Text>
            </TouchableOpacity>
            {onDownloadCategory && (
              <TouchableOpacity style={styles.outlineButton} onPress={onDownloadCategory}>
                <Download size={16} color={colors.slate[600]} />
                <Text style={styles.outlineButtonText}>Télécharger</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {showBack && canGoBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={18} color={colors.slate[600]} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      )}

      {showActions && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.outlineButton} onPress={onOpenCreateFolder}>
            <FolderPlus size={16} color={colors.slate[600]} />
            <Text style={styles.outlineButtonText}>Nouveau dossier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onOpenUpload}>
            <Text style={styles.primaryButtonText}>Importer un fichier</Text>
          </TouchableOpacity>
          {onDownloadCategory && (
            <TouchableOpacity style={styles.outlineButton} onPress={onDownloadCategory}>
              <Download size={16} color={colors.slate[600]} />
              <Text style={styles.outlineButtonText}>Télécharger</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Dossiers */}
      {folders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DOSSIERS</Text>
          <View style={styles.folderGrid}>
            {folders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderCard}
                onPress={() => onFolderClick(folder.id)}
                onLongPress={() => confirmDeleteFolder(folder.id, folder.name)}
                activeOpacity={0.7}
              >
                <View style={styles.folderIconContainer}>
                  <Folder size={28} color={colors.teal[600]} />
                </View>
                <Text style={styles.folderName} numberOfLines={2}>{folder.name}</Text>
                <TouchableOpacity
                  style={styles.folderMoreButton}
                  onPress={() => setFolderMenuOpen(folderMenuOpen === folder.id ? null : folder.id)}
                  accessibilityLabel={`Actions pour ${folder.name}`}
                >
                  <MoreVertical size={18} color={colors.slate[500]} />
                </TouchableOpacity>
                {folderMenuOpen === folder.id && (
                  <View style={styles.folderMenu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { onRenameFolder(folder); setFolderMenuOpen(null); }}>
                      <Pencil size={16} color={colors.slate[600]} />
                      <Text style={styles.menuItemText}>Renommer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={() => { confirmDeleteFolder(folder.id, folder.name); setFolderMenuOpen(null); }}>
                      <Trash2 size={16} color={colors.red[600]} />
                      <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.folderCount}>{folder.itemCount} élément(s)</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Fichiers */}
      {files.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FICHIERS</Text>
          <View style={styles.fileList}>
            {files.map((file) => (
              <View key={file.id} style={styles.fileRow}>
                <FileIcon extension={file.extension} size={22} containerSize={44} />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                  <Text style={styles.fileMeta}>{file.size} • {file.author}</Text>
                </View>
                <View style={styles.fileActions}>
                  {file.isPublic ? (
                    <Globe size={16} color={colors.emerald[500]} />
                  ) : (
                    <Lock size={16} color={colors.slate[400]} />
                  )}
                  <TouchableOpacity onPress={() => onToggleFavorite(file.id)}>
                    <Star
                      size={16}
                      color={file.isFavorite ? colors.amber[400] : colors.slate[300]}
                      fill={file.isFavorite ? colors.amber[400] : 'transparent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDownloadFile(file)} accessibilityLabel={`Télécharger ${file.name}`}>
                    <Download size={16} color={colors.teal[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMenuOpen(menuOpen === file.id ? null : file.id)}>
                    <MoreVertical size={18} color={colors.slate[400]} />
                  </TouchableOpacity>
                </View>

                {/* Menu contextuel */}
                {menuOpen === file.id && (
                  <View style={styles.contextMenu}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => { onToggleShare(file.id); setMenuOpen(null); }}
                    >
                      <Share2 size={16} color={colors.slate[600]} />
                      <Text style={styles.menuItemText}>
                        {file.isShared ? 'Retirer le partage' : 'Partager'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => { onTogglePrivacy(file.id); setMenuOpen(null); }}
                    >
                      {file.isPublic ? (
                        <Lock size={16} color={colors.slate[600]} />
                      ) : (
                        <Globe size={16} color={colors.slate[600]} />
                      )}
                      <Text style={styles.menuItemText}>
                        {file.isPublic ? 'Rendre privé' : 'Rendre public'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.menuItem, styles.menuItemDanger]}
                      onPress={() => confirmDelete(file.id, file.name)}
                    >
                      <Trash2 size={16} color={colors.red[600]} />
                      <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {folders.length === 0 && files.length === 0 && searchQuery !== '' && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptyDesc}>Aucun fichier ou dossier ne correspond à votre recherche.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate[100],
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[700],
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.slate[500],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 15,
    color: colors.slate[600],
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.slate[300],
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  outlineButtonText: {
    fontSize: 14,
    color: colors.slate[600],
    fontWeight: '500',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.teal[600],
  },
  primaryButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate[400],
    letterSpacing: 1,
    marginBottom: 12,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  folderCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.slate[200],
    position: 'relative',
  },
  folderIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.teal[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  folderName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate[700],
    textAlign: 'center',
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 11,
    color: colors.slate[400],
  },
  folderMoreButton: {
    position: 'absolute',
    top: 8,
    right: 6,
    padding: 4,
  },
  folderMenu: {
    position: 'absolute',
    top: 32,
    right: 8,
    zIndex: 20,
    minWidth: 142,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  fileList: {
    gap: 2,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.slate[200],
    overflow: 'hidden',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
    position: 'relative',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate[700],
  },
  fileMeta: {
    fontSize: 12,
    color: colors.slate[400],
    marginTop: 2,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contextMenu: {
    position: 'absolute',
    right: 12,
    top: 44,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    color: colors.slate[700],
  },
  menuItemTextDanger: {
    color: colors.red[600],
  },
});
