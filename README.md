# E-Library Mobile

Application mobile de bibliothèque numérique construite avec **Expo** et **React Native** (TypeScript).

## Fonctionnalités

- **Authentification** : Connexion / Inscription avec formulaire sécurisé
- **Tableau de bord** : Statistiques, fichiers récents, jauge de stockage
- **Bibliothèque** : Navigation par dossiers imbriqués
- **Favoris** : Accès rapide aux fichiers marqués
- **Récents** : Derniers fichiers ajoutés
- **Partagés** : Gestion des fichiers partagés et publics
- **Filtres par type** : Documents, Images, Vidéos, Audio, Archives
- **Gestion des fichiers** : Ajout, suppression, partage, visibilité publique/privée
- **Persistance locale** : Données sauvegardées avec AsyncStorage
- **Mode hors-ligne** : Indicateur de connectivité

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) sur votre téléphone (iOS ou Android)
- **Optionnel** : Android Studio (émulateur Android) ou Xcode (simulateur iOS)

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur Expo
npx expo start
```

## Lancement dans VS Code

### Méthode 1 : Terminal intégré VS Code

Ouvrez le terminal (`Ctrl+ù` ou `Ctrl+\``) et exécutez :

```bash
npm install
npx expo start
```

### Méthode 2 : Tâches VS Code (recommandé)

Utilisez `Ctrl+Shift+B` pour lancer la tâche par défaut **"Expo: Démarrer le serveur"**.

Ou via le menu : **Terminal → Exécuter la tâche...**

### Méthode 3 : Débogage VS Code

1. Installez l'extension **React Native Tools** (`msjsdiag.vscode-react-native`)
2. Allez dans l'onglet **Débogage** (`Ctrl+Shift+D`)
3. Sélectionnez la configuration souhaitée :
   - **Expo Go (Android)** : Lance sur un émulateur Android ou votre téléphone via Expo Go
   - **Expo Go (iOS)** : Lance sur le simulateur iOS (macOS uniquement)
4. Appuyez sur **F5** pour démarrer

## Tester sur votre téléphone

1. Démarrez le serveur avec `npx expo start`
2. Scannez le **QR code** affiché dans le terminal avec :
   - **Android** : L'application Expo Go
   - **iOS** : L'appareil photo natif

## Structure du projet

```
ELibraryMobile/
├── App.tsx                    # Point d'entrée principal
├── app.json                   # Configuration Expo
├── package.json               # Dépendances
├── tsconfig.json              # Configuration TypeScript
├── babel.config.js            # Configuration Babel
├── .vscode/
│   ├── launch.json            # Configurations de débogage
│   ├── tasks.json             # Tâches VS Code
│   ├── settings.json          # Paramètres de l'éditeur
│   └── extensions.json        # Extensions recommandées
└── src/
    ├── lib/
    │   ├── mockData.ts        # Données de démonstration
    │   ├── storage.ts         # Persistance AsyncStorage
    │   └── colors.ts          # Palette de couleurs
    ├── components/
    │   ├── FileIcon.tsx        # Icône par type de fichier
    │   ├── Header.tsx          # Barre de navigation supérieure
    │   ├── BottomTabBar.tsx    # Navigation par onglets
    │   ├── DrawerMenu.tsx      # Menu latéral
    │   ├── CreateFolderModal.tsx # Modal création dossier
    │   └── AddFileModal.tsx    # Modal ajout fichier
    └── screens/
        ├── AuthScreen.tsx      # Écran connexion/inscription
        ├── DashboardScreen.tsx # Tableau de bord
        ├── FileExplorerScreen.tsx # Explorateur de fichiers
        ├── SharedAccessScreen.tsx # Accès partagés
        └── DriveInterface.tsx  # Interface principale
```

## Extensions VS Code recommandées

Les extensions suivantes seront proposées automatiquement à l'ouverture du projet :

| Extension | Description |
|-----------|-------------|
| React Native Tools | Débogage et IntelliSense React Native |
| ESLint | Analyse statique du code |
| Prettier | Formatage automatique |
| Expo Tools | Support Expo dans VS Code |
| TypeScript Next | Support TypeScript avancé |

## Technologies utilisées

| Technologie | Version | Rôle |
|-------------|---------|------|
| Expo | ~51.0.0 | Framework React Native |
| React Native | 0.74.0 | UI mobile native |
| TypeScript | ^5.3.0 | Typage statique |
| AsyncStorage | 1.23.1 | Persistance locale |
| React Navigation | ^6.x | Navigation entre écrans |
| Lucide React Native | ^0.378.0 | Icônes |
| React Native SVG | 15.2.0 | Support SVG |
