# Architecture E-Library

Le projet est organise autour des technologies demandees :

- **Mobile :** Expo / React Native avec TypeScript, dans `src/`.
- **Backend :** API Python FastAPI, dans `backend/app/`.
- **Base de donnees :** PostgreSQL 16, lancee par Docker Compose.

## Demarrage

1. Lancez Docker Desktop puis executez `docker compose up --build` a la racine du projet.
2. Copiez `.env.example` vers `.env` et renseignez l'adresse de l'API :
   - emulation Android : `http://10.0.2.2:8000`
   - iOS ou navigateur : `http://localhost:8000`
   - telephone physique : `http://<IP_DE_VOTRE_PC>:8000`
3. Demarrez le client mobile avec `npm start`.

La documentation interactive de l'API est disponible sur `http://localhost:8000/docs`.
Le client utilise l'API comme source principale et conserve AsyncStorage comme cache hors ligne.
