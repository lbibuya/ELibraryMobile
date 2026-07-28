import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Search, Wifi, WifiOff, LayoutGrid, List, BookOpen, LogOut, Share2 } from 'lucide-react-native';
import { colors } from '../lib/colors';

interface HeaderProps {
  title: string;
  user: { name: string; email: string };
  isOnline: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showSearch: boolean;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onLogout: () => void;
  showMenu: boolean;
  onMenuToggle: () => void;
  onOpenShare?: () => void;
}

export function Header({
  title,
  user,
  isOnline,
  searchQuery,
  onSearchChange,
  showSearch,
  viewMode,
  onViewModeChange,
  onLogout,
  showMenu,
  onMenuToggle,
  onOpenShare,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <View style={styles.logo}>
            <BookOpen size={18} color={colors.white} />
          </View>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.rightActions}>
          <View style={[styles.onlineBadge, isOnline ? styles.onlineBadgeGreen : styles.onlineBadgeAmber]}>
            {isOnline ? (
              <Wifi size={12} color={colors.emerald[600]} />
            ) : (
              <WifiOff size={12} color={colors.amber[600]} />
            )}
            <Text style={[styles.onlineText, isOnline ? styles.onlineTextGreen : styles.onlineTextAmber]}>
              {isOnline ? 'En ligne' : 'Hors-ligne'}
            </Text>
          </View>
          {onOpenShare && (
            <TouchableOpacity style={styles.shareBtn} onPress={onOpenShare}>
              <Share2 size={16} color={colors.slate[500]} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <LogOut size={18} color={colors.slate[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <Search size={16} color={colors.slate[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              placeholderTextColor={colors.slate[400]}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </View>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
              onPress={() => onViewModeChange('grid')}
            >
              <LayoutGrid size={16} color={viewMode === 'grid' ? colors.white : colors.slate[500]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
              onPress={() => onViewModeChange('list')}
            >
              <List size={16} color={viewMode === 'list' ? colors.white : colors.slate[500]} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[200],
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.teal[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.slate[800],
    flex: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  onlineBadgeGreen: {
    backgroundColor: colors.emerald[50],
  },
  onlineBadgeAmber: {
    backgroundColor: colors.amber[50],
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
  },
  onlineTextGreen: {
    color: colors.emerald[600],
  },
  onlineTextAmber: {
    color: colors.amber[600],
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.slate[100],
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.slate[800],
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.slate[100],
    borderRadius: 10,
    padding: 3,
  },
  viewBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnActive: {
    backgroundColor: colors.teal[600],
  },
});
