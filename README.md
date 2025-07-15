# Recouvrement Demo SaaS

## Installation locale

1. \`npm install\`
2. \`npm run dev\`
3. Rendez-vous sur http://localhost:3000

## Déploiement Vercel

1. Créez un compte sur https://vercel.com
2. Connectez votre repo GitHub
3. Importez le projet, cliquez sur "Deploy"
4. Votre démo est en ligne (URL .vercel.app)

### Configuration de l'URL du backend

En production, le frontend doit savoir à quelle adresse se trouve le serveur
Express. Définissez la variable d'environnement `BACKEND_URL` avec l'URL
publique de votre backend (par exemple `https://api.monsite.com`). Si la
variable n'est pas présente, le proxy utilise `http://localhost:3001`.

Assurez‑vous également que `NEXTAUTH_URL` pointe vers le domaine de votre site
(ex. `https://votre-projet.vercel.app`) pour que l'authentification fonctionne.

- Formulaire de mise en demeure (frontend uniquement pour l'instant)
- Dashboard de suivi des créances (connecté à un backend basique)
- Générateur d'injonction de payer (frontend uniquement pour l'instant)
- Pages légales (CGU, RGPD)

## Architecture

Le projet est maintenant composé de deux parties principales :

1.  **Frontend Next.js** (dans le dossier racine) : Gère l'interface utilisateur.
2.  **Backend Node.js/Express** (dans le dossier `backend/`) : Gère la logique métier, les API et la communication avec la base de données.

La base de données utilisée est PostgreSQL, gérée via Docker.

## Développement avec Docker

Pour lancer l'environnement de développement complet (frontend, backend, et base de données) :

1.  **Prérequis :**
    *   Docker et Docker Compose installés.
    *   Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` et remplissez les variables d'environnement nécessaires (notamment `DB_USER`, `DB_PASSWORD`, `DB_NAME`). Les valeurs par défaut fournies dans `.env` devraient fonctionner pour un premier lancement.

2.  **Lancement :**
    À la racine du projet, exécutez :
    ```bash
    docker-compose up --build
    ```
    Cela va construire les images Docker (si elles n'existent pas déjà) et démarrer les services.

    *   Le frontend Next.js sera accessible sur `http://localhost:3000`.
    *   Le backend Express.js sera accessible sur `http://localhost:3001`.
    *   La base de données PostgreSQL sera accessible sur le port `54320` de votre machine hôte (pour une connexion directe avec un client SQL si besoin), et sur `db:5432` pour le service backend.

3.  **Initialisation de la base de données :**
    Au premier lancement, le script `backend/init.sql` sera automatiquement exécuté par `docker-compose` pour créer les tables nécessaires dans la base de données PostgreSQL.

4.  **Arrêt :**
    Pour arrêter les services, appuyez sur `Ctrl+C` dans le terminal où `docker-compose up` est en cours d'exécution, puis vous pouvez exécuter :
    ```bash
    docker-compose down
    ```
    Pour supprimer également les volumes (attention, cela effacera les données de la base de données !) :
    ```bash
    docker-compose down -v
    ```

## Développement local (sans Docker pour le frontend, si préféré)

Si vous préférez lancer le frontend Next.js localement en dehors de Docker (par exemple, pour un rechargement à chaud plus rapide ou une intégration IDE spécifique) :

1.  Assurez-vous que le backend et la base de données sont lancés via Docker Compose :
    ```bash
    docker-compose up --build backend db # Ne lance que le backend et la db
    ```
2.  Dans un autre terminal, à la racine du projet :
    ```bash
    npm install
    npm run dev
    ```
    Le frontend sera accessible sur `http://localhost:3000` et communiquera avec le backend via le proxy configuré dans `next.config.js`.

## Structure du Backend (`backend/`)

*   `server.js`: Point d'entrée du serveur Express.
*   `db.js`: Configuration de la connexion à la base de données PostgreSQL.
*   `init.sql`: Script d'initialisation de la base de données (création des tables).
*   `routes/`: Contient les fichiers de routes pour les différentes API (ex: `claims.js`).
*   `Dockerfile`: Instructions pour construire l'image Docker du backend.
*   `.env.example`: Modèle pour les variables d'environnement du backend.

### Créer un compte superadmin

Pour disposer d'un utilisateur administrateur par défaut, vous pouvez ajouter un
enregistrement dans la base de données après le premier lancement. Exemple avec
`psql` :

```bash
docker-compose exec db psql -U $DB_USER -d $DB_NAME \
  -c "INSERT INTO users (email, password_hash, company_name) VALUES ('yankel1234@hotmail.com', '<HASH_BCRYPT>', 'SuperAdmin') ON CONFLICT DO NOTHING;"
```

Remplacez `<HASH_BCRYPT>` par le hachage bcrypt du mot de passe
`Admin1429`. Vous pouvez le générer avec Node.js :

```bash
node -e "require('bcryptjs').hash('Admin1429', 10).then(h => console.log(h))"
```

La commande affiche le hachage à utiliser dans l'instruction SQL.

## Prochaines Étapes Prévues

*   Mise en place de l'authentification des utilisateurs.
*   Liaison des créances et documents aux utilisateurs.
*   Amélioration des fonctionnalités du dashboard (édition, suppression, détails).
*   Intégration plus poussée de la génération de documents avec le backend (stockage des métadonnées).
