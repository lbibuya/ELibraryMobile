import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FileText, FolderTree, Users, Download, HardDrive, TrendingUp } from 'lucide-react-native';
import { FileItem, Stats } from '../lib/types';
import { colors } from '../lib/colors';
import { FileIcon } from '../components/FileIcon';

interface DashboardScreenProps {
  stats: Stats;
  recentFiles: FileItem[];
}

export function DashboardScreen({ stats, recentFiles }: DashboardScreenProps) {
  const statCards = [
    { title: 'Fichiers', value: stats.totalFiles, Icon: FileText, bg: colors.sky[50], color: colors.sky[600] },
    { title: 'Dossiers', value: stats.totalFolders, Icon: FolderTree, bg: colors.teal[50], color: colors.teal[600] },
    { title: 'Utilisateurs', value: stats.totalUsers, Icon: Users, bg: '#f5f3ff', color: colors.violet[600] },
    { title: 'Téléchargements', value: stats.totalDownloads, Icon: Download, bg: colors.amber[50], color: colors.amber[600] },
  ];

  const storagePercent = Math.round((stats.storageUsed / stats.storageLimit) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Tableau de bord</Text>
      <Text style={styles.subtitle}>Vue d'ensemble de votre activité et de vos ressources.</Text>

      {/* Statistiques */}
      <View style={styles.statsGrid}>
        {statCards.map((card) => (
          <View key={card.title} style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statCardTitle}>{card.title}</Text>
              <View style={[styles.statIconContainer, { backgroundColor: card.bg }]}>
                <card.Icon size={16} color={card.color} />
              </View>
            </View>
            <Text style={styles.statValue}>{card.value}</Text>
            <View style={styles.statTrend}>
              <TrendingUp size={12} color={colors.emerald[600]} />
              <Text style={styles.statTrendText}>+12% ce mois</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Stockage */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HardDrive size={18} color={colors.teal[600]} />
          <Text style={styles.cardTitle}>Stockage</Text>
        </View>
        <Text style={styles.storageInfo}>
          {stats.storageUsed} Go sur {stats.storageLimit} Go utilisés
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${storagePercent}%` as any }]} />
        </View>
        <Text style={styles.storagePercent}>{storagePercent}% utilisé</Text>
      </View>

      {/* Fichiers récents */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fichiers récents</Text>
        <Text style={styles.cardSubtitle}>Les derniers fichiers ajoutés à votre bibliothèque</Text>
        <View style={styles.fileList}>
          {recentFiles.map((file) => (
            <View key={file.id} style={styles.fileRow}>
              <FileIcon extension={file.extension} size={20} containerSize={40} />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                <Text style={styles.fileMeta}>{file.size} • {file.author}</Text>
              </View>
              <Text style={styles.fileDate}>
                {new Date(file.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          ))}
        </View>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.slate[800],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.slate[500],
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 12,
    color: colors.slate[500],
    fontWeight: '500',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.slate[800],
    marginBottom: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: 11,
    color: colors.emerald[600],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.slate[200],
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate[800],
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.slate[500],
    marginBottom: 12,
  },
  storageInfo: {
    fontSize: 13,
    color: colors.slate[500],
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.slate[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.teal[500],
    borderRadius: 4,
  },
  storagePercent: {
    fontSize: 12,
    color: colors.slate[500],
    textAlign: 'right',
  },
  fileList: {
    gap: 12,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
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
  fileDate: {
    fontSize: 11,
    color: colors.slate[400],
  },
});
