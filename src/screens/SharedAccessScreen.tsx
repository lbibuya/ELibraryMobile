import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Share2, Globe, Lock, X } from 'lucide-react-native';
import { FileItem } from '../lib/types';
import { FileIcon } from '../components/FileIcon';
import { colors } from '../lib/colors';

interface SharedAccessScreenProps {
  files: FileItem[];
  onToggleShare: (id: string) => void;
}

export function SharedAccessScreen({ files, onToggleShare }: SharedAccessScreenProps) {
  const sharedFiles = files.filter((f) => f.isShared || f.isPublic);

  if (sharedFiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Share2 size={32} color={colors.slate[400]} />
        </View>
        <Text style={styles.emptyTitle}>Aucun fichier partagé</Text>
        <Text style={styles.emptyDesc}>
          Vous n'avez pas encore partagé de fichiers. Accédez à votre bibliothèque pour partager des fichiers.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Accès Partagés</Text>
      <Text style={styles.pageSubtitle}>
        {sharedFiles.length} fichier(s) partagé(s) ou public(s)
      </Text>

      <View style={styles.fileList}>
        {sharedFiles.map((file) => (
          <View key={file.id} style={styles.fileCard}>
            <FileIcon extension={file.extension} size={22} containerSize={44} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              <Text style={styles.fileMeta}>{file.size} • {file.author}</Text>
              <View style={styles.badgeRow}>
                {file.isPublic && (
                  <View style={styles.badgePublic}>
                    <Globe size={12} color={colors.emerald[600]} />
                    <Text style={styles.badgePublicText}>Public</Text>
                  </View>
                )}
                {file.isShared && (
                  <View style={styles.badgeShared}>
                    <Share2 size={12} color={colors.teal[600]} />
                    <Text style={styles.badgeSharedText}>Partagé</Text>
                  </View>
                )}
                {!file.isPublic && (
                  <View style={styles.badgePrivate}>
                    <Lock size={12} color={colors.slate[500]} />
                    <Text style={styles.badgePrivateText}>Privé</Text>
                  </View>
                )}
              </View>
            </View>
            {file.isShared && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onToggleShare(file.id)}
              >
                <X size={16} color={colors.red[500]} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
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
    lineHeight: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.slate[800],
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.slate[500],
    marginBottom: 20,
  },
  fileList: {
    gap: 10,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate[700],
    marginBottom: 2,
  },
  fileMeta: {
    fontSize: 12,
    color: colors.slate[400],
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badgePublic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emerald[50],
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgePublicText: {
    fontSize: 11,
    color: colors.emerald[600],
    fontWeight: '600',
  },
  badgeShared: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.teal[50],
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeSharedText: {
    fontSize: 11,
    color: colors.teal[600],
    fontWeight: '600',
  },
  badgePrivate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.slate[100],
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgePrivateText: {
    fontSize: 11,
    color: colors.slate[500],
    fontWeight: '600',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.red[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
