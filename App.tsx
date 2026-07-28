import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthScreen } from './src/screens/AuthScreen';
import { DriveInterface } from './src/screens/DriveInterface';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {!isAuthenticated || !user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <DriveInterface user={user} onLogout={handleLogout} />
      )}
    </SafeAreaProvider>
  );
}
