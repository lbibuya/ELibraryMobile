import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  FolderTree,
  Star,
  Clock,
} from 'lucide-react-native';
import { colors } from '../lib/colors';

export type TabView = 'dashboard' | 'library' | 'favorites' | 'recent' | 'shared';
export const BOTTOM_TAB_BAR_HEIGHT = 64;

interface BottomTabBarProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
}

const tabs: { id: TabView; label: string; Icon: any }[] = [
  { id: 'dashboard', label: 'Accueil', Icon: LayoutDashboard },
  { id: 'library', label: 'Bibliothèque', Icon: FolderTree },
  { id: 'favorites', label: 'Favoris', Icon: Star },
  { id: 'recent', label: 'Récents', Icon: Clock },
];

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
              <tab.Icon
                size={20}
                color={isActive ? colors.teal[600] : colors.slate[400]}
              />
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // On web, absolute positioning follows the page height and can disappear below a long dashboard.
    // Fixed keeps the navigation visible from the moment the user connects.
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate[200],
    paddingTop: 8,
    paddingHorizontal: 4,
    zIndex: 9999,
    elevation: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.teal[50],
  },
  label: {
    fontSize: 10,
    color: colors.slate[400],
    fontWeight: '500',
    textAlign: 'center',
  },
  labelActive: {
    color: colors.teal[600],
    fontWeight: '700',
  },
});
