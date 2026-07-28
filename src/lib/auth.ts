import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_USERS_KEY = 'e-library-auth-users-v1';

export interface AuthUser {
  name: string;
  email: string;
  password: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email.trim());
}

async function getStoredUsers(): Promise<AuthUser[]> {
  const stored = await AsyncStorage.getItem(AUTH_USERS_KEY);
  return stored ? (JSON.parse(stored) as AuthUser[]) : [];
}

async function saveUsers(users: AuthUser[]): Promise<void> {
  await AsyncStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

export async function registerUser(user: AuthUser): Promise<AuthUser> {
  const email = normalizeEmail(user.email);
  const users = await getStoredUsers();

  if (users.some((existing) => normalizeEmail(existing.email) === email)) {
    throw new Error('Un compte existe déjà pour cette adresse email.');
  }

  const newUser: AuthUser = {
    name: user.name.trim(),
    email,
    password: user.password,
  };

  users.push(newUser);
  await saveUsers(users);

  return newUser;
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const users = await getStoredUsers();
  return users.find(
    (user) => normalizeEmail(user.email) === normalizedEmail && user.password === password,
  ) ?? null;
}
