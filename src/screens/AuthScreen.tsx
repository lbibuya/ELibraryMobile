import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { BookOpen, Mail, Lock, User, ArrowRight } from 'lucide-react-native';
import { colors } from '../lib/colors';
import { authenticateUser, isValidEmail, registerUser } from '../lib/auth';

interface AuthScreenProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Veuillez saisir une adresse email et un mot de passe.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      return;
    }

    if (!isLogin && !trimmedName) {
      setErrorMessage('Veuillez saisir votre nom complet.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const existingUser = await authenticateUser(trimmedEmail, trimmedPassword);
        if (!existingUser) {
          setErrorMessage('Email ou mot de passe invalide.');
          return;
        }

        onLogin({ name: existingUser.name, email: existingUser.email });
      } else {
        await registerUser({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        });

        setErrorMessage('Inscription réussie. Veuillez vous connecter.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.teal[600]} />
      <View style={styles.content}>
        {/* Header teal */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <BookOpen size={32} color={colors.white} />
          </View>
          <Text style={styles.appName}>LeviCloud</Text>
          <Text style={styles.appSubtitle}>
            Votre bibliothèque numérique sécurisée
          </Text>

          <View style={styles.featureRow}>
            <View style={styles.featureBadge}>
              <Lock size={16} color={colors.teal[100]} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Sécurisé</Text>
                <Text style={styles.featureDesc}>Vos données sont protégées</Text>
              </View>
            </View>
            <View style={styles.featureBadge}>
              <BookOpen size={16} color={colors.teal[100]} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Organisé</Text>
                <Text style={styles.featureDesc}>Arborescence intelligente</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Formulaire */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isLogin
              ? 'Accédez à votre bibliothèque personnelle'
              : 'Rejoignez la communauté LeviCloud'}
          </Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom complet</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color={colors.slate[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Jean Dupont"
                  placeholderTextColor={colors.slate[400]}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.slate[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="exemple@email.com"
                placeholderTextColor={colors.slate[400]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={colors.slate[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.slate[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </Text>
            <ArrowRight size={18} color={colors.white} style={styles.buttonIcon} />
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {isLogin ? 'Pas encore de compte ? ' : 'Vous avez déjà un compte ? '}
            </Text>
            <TouchableOpacity onPress={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
            }}>
              <Text style={styles.switchLink}>
                {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.teal[600],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  header: {
    backgroundColor: colors.teal[600],
    paddingTop: 28,
    paddingHorizontal: 18,
    paddingBottom: 18,
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 13,
    color: colors.teal[100],
    textAlign: 'center',
    marginBottom: 18,
  },
  featureRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  featureBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  featureDesc: {
    fontSize: 10,
    color: colors.teal[100],
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.slate[800],
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.slate[500],
    marginBottom: 18,
  },
  errorText: {
    color: colors.red[600],
    marginBottom: 12,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate[700],
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: 10,
    backgroundColor: colors.slate[50],
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.slate[800],
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal[600],
    borderRadius: 12,
    height: 50,
    marginTop: 6,
    marginBottom: 14,
  },
  disabledButton: {
    opacity: 0.65,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  buttonIcon: {
    marginLeft: 8,
    color: colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  switchText: {
    fontSize: 14,
    color: colors.slate[500],
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.teal[600],
  },
});
