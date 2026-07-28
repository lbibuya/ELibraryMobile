Résumé des modifications

- Frontend (React Native / Expo) : correction dans src/lib/storage.ts pour calculer storageUsed à partir des fichiers locaux lorsque l'API est indisponible. Cela évite d'afficher toujours "0 Go/15 Go" même si des fichiers sont présents localement.
- Backend (FastAPI) : /api/stats mis à jour (backend/app/main.py) pour calculer storageUsed à partir des tailles stockées en base (ex: "2.4 MB", "450 KB", "12.3 Mo", ...). Cela permet à l'application en ligne d'afficher le stockage réel.
- Backend Dockerfile mis à jour pour utiliser la variable PORT fournie par la plateforme (utile pour Render).

Vérification locale rapide

1) Lancer le backend localement (voir backend/.env.example) :
   - Installer les dépendances (virtuelenv recommandé) :
     python -m venv .venv && .\.venv\Scripts\activate
     pip install -r backend\requirements.txt
   - Définir DATABASE_URL (ex: PostgreSQL local) dans backend\.env ou exporter la variable :
     set DATABASE_URL=postgresql://user:pass@localhost:5432/elibrary
   - Démarrer le serveur :
     cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   - Vérifier : http://localhost:8000/health et http://localhost:8000/api/stats

2) Lancer l'application Expo :
   - Installer dépendances : npm install
   - Définir EXPO_PUBLIC_API_URL dans la racine (voir .env.example) pour pointer vers l'API (ex: http://10.0.2.2:8000 pour émulateur Android)
   - Lancer : npm run start

Déploiement backend sur Render (version gratuite) — étapes préparées

Pré-requis : dépôt GitHub avec le code (ou archive téléversée), compte Render

1) Push du repo sur GitHub (si ce n'est pas déjà fait).
2) Dans le tableau de bord Render : New + Web Service.
   - Connecter le dépôt GitHub et choisir le répertoire `backend` (ou la racine si c'est un repo mono).
   - Déploiement : choisir Docker (le dépôt contient backend/Dockerfile). Render construira l'image.
   - Build Command : laisser par défaut si Dockerfile gère l'installation.
   - Start Command : (déjà dans Dockerfile) uvicorn app.main:app --host 0.0.0.0 --port $PORT
3) Créer une base de données PostgreSQL (Managed Database) sur Render ou fournir l'URL d'un Postgres externe.
   - Note : les plans gratuits pour bases peuvent être limités; vérifier l'offre Render.
4) Dans la configuration du service, ajouter les variables d'environnement :
   - DATABASE_URL (format PostgreSQL)
   - API_HOST et API_PORT si utilisé (par défaut le Docker utilise $PORT)
5) Déployer. Le serveur exécutera Base.metadata.create_all() au démarrage et créera les tables.
6) Récupérer l'URL publique fournie par Render (ex: https://my-service.onrender.com) et tester /health et /api/stats.

Fichier de configuration possible (exemple minimal render.yaml)

# Exemple à adapter si vous voulez gérer le déploiement via render.yaml
# Placer à la racine ou dans backend/

# render.yaml (exemple)
# services:
#   - type: web
#     name: elibrary-backend
#     env: docker
#     repo: <votre-repo-github>
#     branch: main
#     dockerfilePath: backend/Dockerfile
#     plan: free

Compilation de l'application Android (option recommandée pour production)

Deux approches principales :
A) Build via EAS (Expo Application Services) — plus simple pour publier sur Play Store
B) Build localement avec Android Studio (pour tests locaux, plus lourde)

A) EAS Build (recommandé)

1) Installer eas-cli : npm install -g eas-cli
2) Initialiser EAS dans le projet (si pas déjà) : eas build:init
3) S'authentifier : eas login
4) Configurer app.json / app.config.js : définir android.package (ex: com.mydomain.levicloud)
5) Définir EXPO_PUBLIC_API_URL dans les variables d'environnement EAS (pour lier l'API à la build) ou utiliser app.config.js pour injecter l'URL de production.
6) Lancer le build production Android : eas build --platform android --profile production
   - Cela génèrera un AAB (format recommandé pour Play Store) ou APK selon le profil.
7) Récupérer l'artefact depuis la page de build EAS et l'installer sur le téléphone ou soumettre au Play Store.

B) Build local (Android Studio)

1) Installer Android Studio et configurer un device ou connecter un appareil Android.
2) Pour Expo managed workflow, exécuter : expo prebuild (si besoin) puis gradlew assembleRelease dans android/ (nécessite configuration de keystore).
3) Générer APK/AAB et installer.

Notes pratiques et points d'attention

- EXPO_PUBLIC_API_URL : doit pointer vers l'URL publique sécurisée (https) du backend. Dans dev utilisez l'adresse adaptée à l'émulateur (10.0.2.2 pour Android). Sans cette variable l'application utilisera le cache local.
- CORS : le backend a CORSMiddleware autorisant "*" — OK pour tests, restreindre en production.
- Storage : la taille affichée dépend du format stocké dans la BDD. Le backend et le frontend acceptent plusieurs formats (KB/MB/GB et Ko/Mo/Go). Pour cohérence, utiliser un format unique (recommandé: octets en base, ou string format standardisé).
- Base de données : le backend crée automatiquement les tables au démarrage si elles n'existent pas (Base.metadata.create_all()).

Prochaines étapes que je peux faire pour vous

- Ajouter un render.yaml prêt à l'emploi et un script README détaillé (je peux le créer automatiquement dans le repo).
- Préparer un fichier app.config.js pour injecter EXPO_PUBLIC_API_URL suivant l'environnement (dev/prod).
- Préparer un profil EAS « production » minimal (eas.json) si vous voulez que je crée le fichier.

Voulez-vous que je :
- ajoute render.yaml et eas.json de base dans le dépôt (je peux les générer),
- ou fournisse uniquement les commandes détaillées pour que vous fassiez le déploiement/build ?

Répondez et je prépare les fichiers correspondants.
