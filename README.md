# [Kurso]

##  Backend de plateforme de cours en ligne.

##  Installation et Configuration:

    git clone https://github.com/toleen-m/Kurso_E-Learning.git

    cd backend

Installation des dépendances:

    npm install

Configuration des variables d'environnement :

    Crée un fichier .env à la racine du backend du projet et ajouter:
    
    DATABASE_URL="" : Le lien vers votre Neon
    PORT=3000
    OPENTDB_API="https://opentdb.com"
    JWT_SECRET="febb79399dff647540cd0bea43fad826b66b3e7e4cb8e09c4c04e627f98d7f22"
    

Initialiser Prisma (Base de données) :

Générer le client Prisma et lancer les migrations pour créer les tables:

    npx prisma generate
    npx prisma migrate dev --name init
    
Lancer le serveur:

    npm run dev

##  Liste des routes:

### 1. Authentification

    `POST` Création de compte (Etudiant, Formateur ou Admin), Route: `/auth/register`
    `POST` Connexion, Route: `/auth/login`


---

### 4. Quiz

    `GET` Liste de tous les quizs, Route: `/api/quiz`
    `GET` Afficher un quiz et ses questions, Route: `/api/quiz/:id`
    `PUT` Modifier un quiz, Route: `api/quiz/:id`
    `POST` Ajoute un nouveau quiz, Route: `/api/quiz/importer`
    `PATCH` Associer un quiz a un Lecon, Route: `/api/quiz/:id/lier-lecon`
    `DELETE` Supprime un quiz, Route: `/api/quiz/:id`

---
