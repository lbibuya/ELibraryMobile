import React, { useMemo, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, Share, Alert, Linking, Platform } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { colors } from '../lib/colors';
import { FileItem } from '../lib/types';
import { getResourceType } from '../lib/resourceTypes';

type Props = {
  visible: boolean;
  onClose: () => void;
  files: FileItem[];
};

const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'documents', label: 'Documents' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Vidéos' },
  { id: 'audio', label: 'Audio' },
  { id: 'archives', label: 'Archives' },
  { id: 'favorites', label: 'Favoris' },
  { id: 'recent', label: 'Récents' },
];

export function ShareResourcesModal({ visible, onClose, files }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filteredFiles = useMemo(() => {
    const q = filter;
    if (q === 'all') return files;
    if (q === 'favorites') return files.filter((f) => f.isFavorite);
    if (q === 'recent') return [...files].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
    return files.filter((f) => getResourceType(f.extension) === q);
  }, [files, filter]);

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const getSelectedFiles = (): FileItem[] => {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    if (ids.length === 0) return filteredFiles;
    return filteredFiles.filter((f) => ids.includes(f.id));
  };

  const buildMessage = (items: FileItem[]) => {
    if (items.length === 0) return 'Aucun fichier sélectionné.';
    return items.map((f) => `• ${f.name} (${f.extension}) - ${f.size}`).join('\n');
  };

  const shareGeneric = async () => {
    const items = getSelectedFiles();
    if (items.length === 0) { Alert.alert('Rien à partager', 'Sélectionnez des fichiers ou changez le filtre.'); return; }
    const message = `Partage LeviCloud:\n\n${buildMessage(items)}`;
    try {
      await Share.share({ message });
      onClose();
    } catch (err) {
      Alert.alert('Partage impossible', 'Une erreur est survenue lors du partage.');
    }
  };

  const shareWhatsApp = async () => {
    const items = getSelectedFiles();
    if (items.length === 0) { Alert.alert('Rien à partager', 'Sélectionnez des fichiers ou changez le filtre.'); return; }
    const message = `LeviCloud - fichiers:\n${items.map((f) => f.name).join('\n')}`;
    const encoded = encodeURIComponent(message);
    const scheme = `whatsapp://send?text=${encoded}`;
    const web = `https://api.whatsapp.com/send?text=${encoded}`;
    try {
      const can = await Linking.canOpenURL(scheme);
      await Linking.openURL(can ? scheme : web);
      onClose();
    } catch (err) {
      Alert.alert('WhatsApp indisponible', 'Impossible d’ouvrir WhatsApp sur cet appareil.');
    }
  };

  const shareFacebook = async () => {
    const items = getSelectedFiles();
    if (items.length === 0) { Alert.alert('Rien à partager', 'Sélectionnez des fichiers ou changez le filtre.'); return; }
    // Facebook web sharer needs a URL; fallback to sharing text via generic share
    const message = `LeviCloud - fichiers:\n${items.map((f) => f.name).join('\n')}`;
    const encoded = encodeURIComponent(message);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
    try {
      const can = await Linking.canOpenURL('fb://');
      if (can) {
        // There is no simple fb:// share with text across platforms; use generic share as fallback
        await Share.share({ message });
      } else {
        await Linking.openURL(shareUrl);
      }
      onClose();
    } catch (err) {
      Alert.alert('Facebook indisponible', 'Impossible d’ouvrir Facebook sur cet appareil.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.closeArea} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Partager des ressources</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.slate[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.filtersRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity key={f.id} onPress={() => setFilter(f.id)} style={[styles.filterBtn, filter === f.id && styles.filterBtnActive]}>
                <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.listContainer}>
            <FlatList
              data={filteredFiles}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemMeta}>{item.size} • {item.author}</Text>
                  </View>
                  <View style={styles.itemRight}>
                    {selected[item.id] ? <Check size={18} color={colors.teal[600]} /> : <View style={styles.placeholderCheck} />}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={shareGeneric}>
              <Text style={styles.primaryText}>Partager</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={shareWhatsApp}>
              <Text style={styles.secondaryText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={shareFacebook}>
              <Text style={styles.secondaryText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  closeArea: { flex: 1 },
  sheet: {
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '700', color: colors.slate[800] },
  closeBtn: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.slate[50], marginRight: 8 },
  filterBtnActive: { backgroundColor: colors.teal[50] },
  filterText: { fontSize: 12, color: colors.slate[600] },
  filterTextActive: { color: colors.teal[700], fontWeight: '700' },
  listContainer: { flex: 1, marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.slate[100] },
  itemLeft: { flex: 1 },
  itemName: { fontSize: 14, color: colors.slate[800], fontWeight: '600' },
  itemMeta: { fontSize: 12, color: colors.slate[400], marginTop: 2 },
  itemRight: { width: 40, alignItems: 'center', justifyContent: 'center' },
  placeholderCheck: { width: 18, height: 18 },
  actionsRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  primaryBtn: { flex: 1, backgroundColor: colors.teal[600], borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginRight: 8 },
  primaryText: { color: colors.white, fontWeight: '700' },
  secondaryBtn: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, backgroundColor: colors.slate[100], alignItems: 'center' },
  secondaryText: { color: colors.slate[700], fontWeight: '700' },
});
