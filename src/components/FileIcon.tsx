import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
} from 'lucide-react-native';
import { colors } from '../lib/colors';
import { getResourceType } from '../lib/resourceTypes';

interface FileIconProps {
  extension: string;
  size?: number;
  containerSize?: number;
}

export function getFileIconConfig(extension: string) {
  const type = getResourceType(extension);
  if (type === 'images') {
    return { Icon: Image, bg: colors.violet[50], color: colors.violet[600] };
  }
  if (type === 'videos') {
    return { Icon: Video, bg: colors.indigo[50], color: colors.indigo[600] };
  }
  if (type === 'audio') {
    return { Icon: Music, bg: colors.amber[50], color: colors.amber[600] };
  }
  if (type === 'archives') {
    return { Icon: Archive, bg: colors.teal[50], color: colors.teal[600] };
  }
  if (type === 'documents') {
    return { Icon: FileText, bg: colors.sky[50], color: colors.sky[600] };
  }
  return { Icon: File, bg: colors.slate[100], color: colors.slate[600] };
}

export function FileIcon({ extension, size = 24, containerSize = 48 }: FileIconProps) {
  const { Icon, bg, color } = getFileIconConfig(extension);
  return (
    <View style={[styles.container, { width: containerSize, height: containerSize, backgroundColor: bg, borderRadius: containerSize * 0.25 }]}>
      <Icon size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
