# Kurso

Kurso est une plateforme d'apprentissage en ligne développée avec **Next.js**.
La plateforme permet aux étudiants de suivre des cours, consulter des leçons et réaliser des quiz.

Les utilisateurs peuvent également demander à devenir formateurs. Un administrateur peut ensuite accepter ou refuser ces demandes.

---

# Présentation

**Kurso** est une application web d'apprentissage en ligne.

L'objectif est de permettre à un étudiant de :

* créer un compte;
* se connecter;
* consulter les cours disponibles;
* s'inscrire à un cours;
* consulter les leçons;
* réaliser des quiz;
* consulter ses résultats;
* consulter les corrections des quiz;
* voir ses cours;
* voir ses quiz faits et pas faits;
* demander à devenir formateur.

---

# Fonctionnalités

## Étudiant

L'étudiant peut :

* consulter les cours;
* s'inscrire à un cours;
* accéder aux cours auxquels il est inscrit;
* consulter les leçons;
* consulter les quiz;
* faire un quiz;
* voir son score;
* voir la correction;
* consulter ses quiz faits;
* consulter ses quiz pas encore faits;
* demander à devenir formateur.

---

## Formateur

Le formateur possède les fonctionnalités d'un étudiant.

Il peut également :

* créer un cours;
* créer une leçon;
* créer un quiz;
* gérer les quiz de ses cours;
* supprimer ses quiz.

Un formateur peut seulement gérer les cours qu'il a lui-même créés.

---

## Administrateur

L'administrateur possède les fonctionnalités d'un étudiant et formateur.

Il peut également :

* consulter les demandes de formateur;
* accepter une demande;
* refuser une demande.

Lorsqu'une demande est acceptée, le rôle de l'utilisateur devient automatiquement :

```text
FORMATEUR
```

---

# Technologies utilisées

Le projet utilise principalement :

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Prisma**
* **PostgreSQL**
* **Clerk**
* **Open Trivia Database (OpenTDB)**

---

# Installation

## 1. Cloner le projet

```bash
git clone https://github.com/toleen-m/Kurso_E-Learning.git
```

Entrer dans le projet :

```bash
cd kurso-e-learning
```

---

## 2. Installer les dépendances

```bash
npm install
```

---

## 3. Configurer les variables d'environnement

Créer un fichier :

```text
.env
```

Les variables nécessaires se trouvent dans .env.example

Exemple :

```env
DATABASE_URL=""

#De votre clerk 
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# changer rien ici
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

```

# Base de données

Kurso utilise **PostgreSQL** avec **Prisma**.

Après avoir installé le projet, générer le client Prisma avec :

```bash
npx prisma generate
```


---

# Lancer le serveur

Pour travailler sur le projet :

```bash
npm run dev
```

---

# Fonctionnement des cours

Un étudiant peut consulter les cours disponibles.

L'utilisateur doit s'inscrit à un cours pour pouvoire ensuite accéder au contenu du cours.

Lorsqu'une page de leçon ou de quiz est consultée, l'application vérifie que l'utilisateur est inscrit au cours.

Le formateur propriétaire du cours peut toutefois accéder à son propre cours sans inscription.

---

# Vérification de l'inscription

Pour protéger l'accès aux quiz, l'application vérifie :

```text
utilisateurId
+
coursId
```

avec le modèle `Inscription`.

Un utilisateur non inscrit ne peut donc pas simplement accéder directement à une URL de quiz.

Le propriétaire du cours est autorisé à accéder à son cours même sans inscription.

---

# Fonctionnement des quiz

Les quiz sont créés par les formateurs.

Lors de la création d'un quiz, l'application utilise **Open Trivia Database** pour récupérer des questions.

Les questions récupérées sont ensuite enregistrées dans Prisma.

---

# Création d'un quiz

Le parcours de création est :

```text
Formateur
    ↓
Nouvelle leçon
    ↓
Créer un quiz
    ↓
Récupération des questions OpenTDB
    ↓
Création du Quiz
    ↓
Création des Questions
```

Les questions sont enregistrées dans le model:

```text
Question
```

---

# Réaliser un quiz

Lorsqu'un étudiant commence un quiz :

* les questions sont affichées;
* chaque question possède plusieurs réponses;
* une seule réponse peut être sélectionnée;
* toutes les questions doivent être complétées.

Les réponses sont envoyées à une Server Action.

La Server Action compare les réponses de l'étudiant avec :

```text
question.bonneReponse
```

---

# Calcul du score

Le score est calculé.

Le résultat est ensuite enregistré dans :

```text
QuizFait
```

---

# Quiz faits et quiz pas faits

La page :

```text
/profile/mesQuiz
```

permet à l'étudiant de voir ses quiz.

Les quiz sont séparés en deux catégories.

## Quiz pas faits

Cette section contient les quiz pour lesquels aucun `QuizFait` n'existe pour l'utilisateur.

Le bouton :

```text
Commencer le quiz
```

permet de commencer le quiz.

## Quiz faits

Cette section contient les quiz pour lesquels l'utilisateur possède déjà un `QuizFait`.

La page affiche :

```text
Score
Bonnes réponses
Nombre total de questions
```

et propose :

```text
Voir la correction
```

---

# Correction d'un quiz

Après avoir terminé un quiz, l'étudiant peut accéder à :

```text
/cours/[coursId]/lecons/[leconId]/quiz/[quizId]/correction
```

La correction affiche les  bonnes réponses.

---

# Système de demande formateur

Un étudiant peut accéder à :

```text
/profile
```

et choisir :

```text
Demander à devenir formateur
```

Le formulaire demande :

* l'expertise;
* la motivation.

Une nouvelle demande est créée avec le statut :

```text
EN_ATTENTE
```

---

# Gestion des demandes

L'administrateur peut accéder à :

```text
/profile/gererDemandes
```

Cette page affiche les demandes reçues.

Pour chaque demande, l'administrateur peut :

```text
Accepter
```

ou :

```text
Refuser
```

---

# Acceptation d'une demande

Lorsqu'une demande est acceptée :

```text
DemandeFormateur.statut = ACCEPTEE
```

et :

```text
Utilisateur.role = FORMATEUR
```

L'utilisateur peut ensuite créer des cours.

---

# Refus d'une demande

Lorsqu'une demande est refusée :

```text
DemandeFormateur.statut = REFUSEE
```

L'utilisateur reste étudiant.

---

# Routes principales

## Accueil

```text
/
```

Page d'accueil de Kurso.

---

## Cours

```text
/cours
```

Affiche les cours disponibles et donne formulaire de creation pour les formateurs.

---

## Mes cours

```text
/cours/mes-cours
```

Affiche les cours auxquels l'étudiant est inscrit.

---

## Cours

```text
/cours/[coursId]
```

Affiche un cours et ces lecons.

---

## Leçon

```text
/cours/[coursId]/lecons/[leconId]
```

Affiche une leçon.

---

## Créer un quiz

```text
/cours/[coursId]/lecons/[leconId]/quiz/newQuiz
```

Permet au formateur de créer un quiz.

---

## Liste des quiz d'une leçon

```text
/cours/[coursId]/lecons/[leconId]/quiz
```

Affiche les quiz d'une leçon.

---

## Faire un quiz

```text
/cours/[coursId]/lecons/[leconId]/quiz/[quizId]
```

Permet à l'étudiant de réaliser le quiz.

---

## Correction

```text
/cours/[coursId]/lecons/[leconId]/quiz/[quizId]/correction
```

Affiche la correction du quiz.

---

## Mes quiz

```text
/profile/mesQuiz
```

Affiche :

* les quiz faits;
* les quiz pas faits;
* les scores;

---

## Profil

```text
/profile
```

Affiche les informations de l'utilisateur.

---

## Demande formateur

```text
/profile/demande-formateur
```

Permet à un étudiant de demander à devenir formateur.

---

## Gestion des demandes

```text
/profile/gererDemandes
```

Page réservée aux administrateurs.

---

# Authentification

Kurso utilise **Clerk** pour gérer l'authentification.

Clerk permet notamment :

* la connexion;
* l'inscription;
* la gestion de session;
* la protection des pages.

L'utilisateur connecté dans Clerk est associé à un utilisateur dans PostgreSQL grâce à :

```text
Utilisateur.clerkId
```

---

# Création d'un utilisateur

Lorsqu'un utilisateur est créé dans l'application, il possède par défaut le rôle :

```text
ETUDIANT
```

Le rôle peut ensuite devenir :

```text
FORMATEUR
```

après acceptation d'une demande par un administrateur.

---

# API des questions

Kurso possède une route API :

```text
/api/questions
```

Elle récupère cinq questions à choix multiples depuis Open Trivia Database.

La route utilise :

```text
https://opentdb.com/api.php?amount=5&type=multiple
```

Elle retourne les données au format JSON.

---


# Permissions

Kurso vérifie les permissions côté serveur.

Un étudiant ne doit pas pouvoir :

* créer un cours;
* créer un quiz;
* supprimer le quiz d'un autre formateur;
* gérer les demandes de formateur.

Un formateur ne peut gérer que ses propres cours.

Un administrateur est nécessaire pour accepter ou refuser une demande de formateur.

---

# Résumé

L'application permet :

* l'authentification;
* la gestion des utilisateurs;
* la gestion des rôles;
* la création de cours;
* la création de leçons;
* la création automatique de quiz;
* la réalisation des quiz;
* le calcul des scores;
* la correction des quiz;
* l'inscription aux cours;
* la gestion des demandes de formateur;
* la gestion des permissions.

---

# Auteur

- Toleen Msabeh
- Unaiza Ali, Bhatti
- Zeka, Maxance
- Sainvry, Fabiola


Projet **Kurso — E-learning**

