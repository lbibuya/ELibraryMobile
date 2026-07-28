import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Upload,
  X,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  HardDrive,
} from 'lucide-react-native';
import { colors } from '../lib/colors';

interface AddFileModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (fileName: string, category: string, extension: string) => void;
  userName: string;
}

const categories = [
  { label: 'Document', Icon: FileText, bg: colors.sky[50], color: colors.sky[600], ext: 'pdf', cat: 'Documents' },
  { label: 'Image', Icon: Image, bg: '#f5f3ff', color: colors.violet[600], ext: 'png', cat: 'Images' },
  { label: 'Vidéo', Icon: Video, bg: '#eef2ff', color: colors.indigo[600], ext: 'mp4', cat: 'Vidéos' },
  { label: 'Audio', Icon: Music, bg: colors.amber[50], color: colors.amber[600], ext: 'mp3', cat: 'Audio' },
  { label: 'Archive', Icon: Archive, bg: colors.teal[50], color: colors.teal[600], ext: 'zip', cat: 'Archives' },
  { label: 'Autre', Icon: HardDrive, bg: colors.slate[100], color: colors.slate[600], ext: 'txt', cat: 'Autre' },
];

export function AddFileModal({ visible, onClose, onAdd, userName }: AddFileModalProps) {
  const [fileName, setFileName] = useState('');
  const [selectedCat, setSelectedCat] = useState<typeof categories[0] | null>(null);

  const handleAdd = () => {
    if (!fileName.trim() || !selectedCat) return;
    const name = fileName.trim().includes('.') ? fileName.trim() : `${fileName.trim()}.${selectedCat.ext}`;
    onAdd(name, selectedCat.cat, selectedCat.ext);
    setFileName('');
    setSelectedCat(null);
  };

  const handleClose = () => {
    setFileName('');
    setSelectedCat(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={styles.modal}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Upload size={20} color={colors.teal[600]} />
              <Text style={styles.title}>Ajouter un fichier</Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={20} color={colors.slate[400]} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Saisissez le nom du fichier et sélectionnez son type pour l'ajouter à votre bibliothèque.
          </Text>

          {/* Sélection du type */}
          <Text style={styles.label}>Type de fichier</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                style={[
                  styles.categoryCard,
                  selectedCat?.label === cat.label && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCat(cat)}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                  <cat.Icon size={20} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nom du fichier */}
          <Text style={styles.label}>Nom du fichier</Text>
          <TextInput
            style={styles.input}
            placeholder={selectedCat ? `Ex: Mon fichier.${selectedCat.ext}` : 'Ex: Mon document.pdf'}
            placeholderTextColor={colors.slate[400]}
            value={fileName}
            onChangeText={setFileName}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, (!fileName.trim() || !selectedCat) && styles.addButtonDisabled]}
              onPress={handleAdd}
              disabled={!fileName.trim() || !selectedCat}
            >
              <Text style={styles.addText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.slate[200],
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.slate[800],
  },
  subtitle: {
    fontSize: 13,
    color: colors.slate[500],
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate[700],
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.slate[200],
    backgroundColor: colors.slate[50],
  },
  categoryCardSelected: {
    borderColor: colors.teal[500],
    backgroundColor: colors.teal[50],
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.slate[600],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.slate[800],
    backgroundColor: colors.slate[50],
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: colors.slate[600],
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.teal[600],
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.slate[300],
  },
  addText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
});
