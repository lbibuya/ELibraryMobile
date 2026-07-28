import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  X,
  BookOpen,
} from 'lucide-react-native';
import { colors } from '../lib/colors';
import { Stats } from '../lib/types';

export type LibraryView = 'documents' | 'images' | 'videos' | 'audio' | 'archives';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  activeView: string;
  onViewChange: (view: LibraryView) => void;
  stats: Stats;
}

const libraryItems: { id: LibraryView; label: string; Icon: any }[] = [
  { id: 'documents', label: 'Fichiers', Icon: FileText },
  { id: 'images', label: 'Galerie', Icon: Image },
  { id: 'videos', label: 'Vidéos', Icon: Video },
  { id: 'audio', label: 'Audio', Icon: Music },
  { id: 'archives', label: 'Archives', Icon: Archive },
];

export function DrawerMenu({ visible, onClose, activeView, onViewChange, stats }: DrawerMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.drawer}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <BookOpen size={20} color={colors.white} />
            </View>
            <Text style={styles.appName}>LeviCloud</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={colors.slate[500]} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>BIBLIOTHÈQUE</Text>
          {libraryItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => { onViewChange(item.id); onClose(); }}
                activeOpacity={0.7}
              >
                <item.Icon size={18} color={isActive ? colors.teal[600] : colors.slate[500]} />
                <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Stockage */}
          <View style={styles.storageCard}>
            <View style={styles.storageHeader}>
              <Text style={styles.storageTitle}>Stockage</Text>
              <Text style={styles.storageInfo}>{stats.storageUsed} / {stats.storageLimit} Go</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round((stats.storageUsed / stats.storageLimit) * 100)}%` as any },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    width: 280,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.teal[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[800],
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate[400],
    letterSpacing: 1,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: colors.teal[50],
  },
  menuItemText: {
    fontSize: 15,
    color: colors.slate[600],
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: colors.teal[700],
    fontWeight: '700',
  },
  storageCard: {
    marginTop: 24,
    backgroundColor: colors.slate[50],
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate[600],
  },
  storageInfo: {
    fontSize: 12,
    color: colors.slate[400],
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.slate[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.teal[500],
    borderRadius: 3,
  },
});
