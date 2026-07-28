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
} from 'react-native';
import { FolderPlus, X } from 'lucide-react-native';
import { colors } from '../lib/colors';

interface CreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  initialName?: string;
  title?: string;
  submitLabel?: string;
}

export function CreateFolderModal({ visible, onClose, onCreate, initialName = '', title = 'Nouveau dossier', submitLabel = 'Créer' }: CreateFolderModalProps) {
  const [name, setName] = useState(initialName);

  React.useEffect(() => { if (visible) setName(initialName); }, [initialName, visible]);

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <FolderPlus size={20} color={colors.teal[600]} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={20} color={colors.slate[400]} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nom du dossier</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Cours de mathématiques"
            placeholderTextColor={colors.slate[400]}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreate}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={!name.trim()}
            >
              <Text style={styles.createText}>{submitLabel}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    width: '88%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate[700],
    marginBottom: 8,
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
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: colors.slate[600],
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    backgroundColor: colors.teal[600],
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: colors.slate[300],
  },
  createText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
});
