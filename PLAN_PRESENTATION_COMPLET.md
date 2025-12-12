# 🎤 PLAN DE PRÉSENTATION COMPLET — Chat E2EE

## Informations générales
- **Durée totale** : 20-25 minutes
- **Public cible** : Jury technique / Enseignants / Professionnels IT
- **Support** : PowerPoint + Démo live
- **Présentateur** : Ahmed Amine Bejaoui

---

# 📑 STRUCTURE DES SLIDES

---

## 🎬 SLIDE 1 : Page de titre (30 secondes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                      🔐 CHAT E2EE                           ║
║                                                              ║
║     Application de messagerie sécurisée avec chiffrement    ║
║              de bout en bout et appels WebRTC               ║
║                                                              ║
║  ─────────────────────────────────────────────────────────  ║
║                                                              ║
║              Présenté par : Ahmed Amine Bejaoui             ║
║                     Date : Décembre 2025                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Bonjour à tous. Je m'appelle Ahmed Amine Bejaoui et aujourd'hui je vais vous présenter Chat E2EE, une application de messagerie instantanée sécurisée que j'ai développée. Cette application permet d'échanger des messages, des fichiers et de passer des appels audio/vidéo, le tout avec un chiffrement de bout en bout. Commençons par comprendre le contexte de ce projet."

---

## 🎬 SLIDE 2 : Contexte et problématique (2 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  📋 CONTEXTE & PROBLÉMATIQUE                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🔴 PROBLÈMES ACTUELS                                        ║
║  ├── Surveillance massive des communications                 ║
║  ├── Fuites de données (Facebook, WhatsApp metadata)        ║
║  ├── Serveurs centralisés = point unique de défaillance     ║
║  └── Confiance aveugle envers les fournisseurs              ║
║                                                              ║
║  📊 STATISTIQUES                                             ║
║  ├── 2.7 milliards d'utilisateurs de messagerie en 2025    ║
║  ├── 68% des utilisateurs préoccupés par leur vie privée   ║
║  └── +300% d'attaques sur les communications en 5 ans      ║
║                                                              ║
║  ❓ QUESTION CENTRALE                                        ║
║  "Comment garantir la confidentialité des communications    ║
║   sans dépendre d'un tiers de confiance ?"                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Avant de vous montrer l'application, comprenons pourquoi ce projet existe. 
> 
> Aujourd'hui, nous échangeons des milliards de messages chaque jour. Mais ces communications passent par des serveurs centralisés appartenant à des entreprises privées. Facebook, Google, et même certaines applications dites 'sécurisées' collectent des métadonnées.
> 
> Les scandales se multiplient : Cambridge Analytica, les fuites de données WhatsApp, les backdoors gouvernementales. 68% des utilisateurs sont préoccupés par leur vie privée, mais continuent d'utiliser ces services faute d'alternative simple.
> 
> La question centrale est donc : comment peut-on communiquer en toute confidentialité, sans faire confiance à un serveur central qui pourrait être compromis, piraté, ou contraint par la loi de livrer nos données ?
> 
> C'est exactement ce problème que Chat E2EE résout."

---

## 🎬 SLIDE 3 : Objectifs du projet (1 minute 30)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🎯 OBJECTIFS DU PROJET                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ✅ OBJECTIFS FONCTIONNELS                                   ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ 1. Messagerie instantanée temps réel                    │ ║
║  │ 2. Partage de fichiers (images, documents, audio)       │ ║
║  │ 3. Appels audio/vidéo peer-to-peer                      │ ║
║  │ 4. Groupes jusqu'à 100 membres                          │ ║
║  │ 5. Application mobile Android (APK)                     │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  🔒 OBJECTIFS DE SÉCURITÉ                                    ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ 1. Chiffrement E2E : serveur JAMAIS accès au contenu    │ ║
║  │ 2. Clés générées et stockées côté CLIENT uniquement     │ ║
║  │ 3. Perfect Forward Secrecy (clés de session)            │ ║
║  │ 4. Aucune persistance des messages côté serveur         │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Mon projet avait deux catégories d'objectifs.
> 
> Premièrement, les objectifs fonctionnels : créer une application de messagerie complète avec envoi de messages en temps réel, partage de fichiers et images, enregistrement de messages vocaux, et surtout des appels audio et vidéo. J'ai aussi ajouté le support des groupes jusqu'à 100 membres et une version mobile Android.
> 
> Deuxièmement, et c'est le cœur du projet, les objectifs de sécurité. Le principe fondamental est que le serveur ne doit JAMAIS pouvoir lire le contenu des messages. Les clés de chiffrement sont générées et stockées uniquement sur les appareils des utilisateurs. Même si quelqu'un pirate le serveur, il n'obtient que des données chiffrées, inutilisables.
> 
> C'est ce qu'on appelle le chiffrement de bout en bout, ou E2EE."

---

## 🎬 SLIDE 4 : Architecture technique globale (3 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🏗️ ARCHITECTURE TECHNIQUE                                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌──────────────┐                      ┌──────────────┐     ║
║  │  CLIENT A    │                      │  CLIENT B    │     ║
║  │  (React)     │                      │  (React)     │     ║
║  │              │    ════════════════  │              │     ║
║  │ ┌──────────┐ │    MEDIA P2P DIRECT  │ ┌──────────┐ │     ║
║  │ │ WebRTC   │◄├────────────────────►─┤►│ WebRTC   │ │     ║
║  │ └──────────┘ │    (Audio/Vidéo)     │ └──────────┘ │     ║
║  │              │                      │              │     ║
║  │ ┌──────────┐ │                      │ ┌──────────┐ │     ║
║  │ │WebCrypto │ │                      │ │WebCrypto │ │     ║
║  │ │AES + RSA │ │                      │ │AES + RSA │ │     ║
║  │ └──────────┘ │                      │ └──────────┘ │     ║
║  └──────┬───────┘                      └──────┬───────┘     ║
║         │ Socket.io                   Socket.io │           ║
║         │ (Signaling)                (Signaling)│           ║
║         ▼                                      ▼            ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │              SERVEUR NODE.JS (Render)                  │ ║
║  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ ║
║  │  │  Socket.io  │  │  Express    │  │  In-Memory  │    │ ║
║  │  │  Signaling  │  │  REST API   │  │  Channels   │    │ ║
║  │  └─────────────┘  └─────────────┘  └─────────────┘    │ ║
║  │                                                        │ ║
║  │  ⚠️ NE VOIT JAMAIS LE CONTENU (données chiffrées)     │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Voici l'architecture technique de Chat E2EE. Elle se compose de trois éléments principaux.
> 
> **Premièrement, les clients** — développés en React avec TypeScript. Chaque client intègre deux modules critiques : WebCrypto pour le chiffrement, et WebRTC pour les appels audio/vidéo. C'est sur le client que se fait tout le travail de chiffrement et déchiffrement.
> 
> **Deuxièmement, le serveur Node.js** — hébergé sur Render. Il a trois responsabilités : gérer les connexions Socket.io pour le temps réel, fournir une API REST pour créer les canaux de chat, et maintenir en mémoire la liste des utilisateurs connectés. Point crucial : le serveur ne fait que transmettre des paquets chiffrés. Il ne possède pas les clés et ne peut pas lire le contenu.
> 
> **Troisièmement, la connexion WebRTC** — pour les appels audio/vidéo. Cette connexion est directe entre les deux clients, peer-to-peer. Les flux média ne passent jamais par notre serveur, ce qui réduit la latence et garantit la confidentialité.
> 
> Le serveur joue uniquement le rôle de 'facteur' : il transmet des enveloppes scellées sans pouvoir les ouvrir."

---

## 🎬 SLIDE 5 : Stack technologique (1 minute 30)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🛠️ STACK TECHNOLOGIQUE                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FRONTEND                          BACKEND                   ║
║  ┌────────────────────┐           ┌────────────────────┐    ║
║  │ ⚛️  React 18        │           │ 🟢 Node.js         │    ║
║  │ 📘 TypeScript      │           │ 📘 TypeScript      │    ║
║  │ 🎨 Tailwind CSS    │           │ 🔌 Socket.io       │    ║
║  │ 📱 Capacitor       │           │ 🚀 Express         │    ║
║  └────────────────────┘           └────────────────────┘    ║
║                                                              ║
║  SÉCURITÉ                          DÉPLOIEMENT              ║
║  ┌────────────────────┐           ┌────────────────────┐    ║
║  │ 🔐 WebCrypto API   │           │ ☁️  Render (Backend)│    ║
║  │ 🔑 RSA-OAEP 2048   │           │ 🔥 Firebase Hosting│    ║
║  │ 🔒 AES-GCM 256     │           │ 🤖 Android APK     │    ║
║  │ 📹 WebRTC          │           │ 🔄 CI/CD auto      │    ║
║  └────────────────────┘           └────────────────────┘    ║
║                                                              ║
║  TESTS & QUALITÉ                                            ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ ✅ Jest (tests unitaires) │ 📋 ESLint │ 📝 TypeScript │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Parlons maintenant des technologies utilisées.
> 
> **Côté frontend** : React 18 avec TypeScript pour la robustesse du typage. Tailwind CSS pour un design moderne et responsive. Et Capacitor pour générer l'application mobile Android à partir du même code.
> 
> **Côté backend** : Node.js avec TypeScript également, pour la cohérence. Socket.io gère toute la communication temps réel. Express fournit l'API REST.
> 
> **Pour la sécurité** : j'utilise exclusivement la WebCrypto API, qui est l'API native des navigateurs pour la cryptographie. C'est implémenté en code natif, optimisé et audité. RSA-OAEP avec des clés de 2048 bits pour l'échange de clés, et AES-GCM 256 bits pour le chiffrement symétrique des messages.
> 
> **Pour le déploiement** : le backend est sur Render avec déploiement automatique à chaque commit. Le frontend statique est sur Firebase Hosting. Et j'ai généré un APK signé pour Android.
> 
> Tout le code est typé et testé avec Jest."

---

## 🎬 SLIDE 6 : Fonctionnement du chiffrement E2EE (4 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🔐 CHIFFREMENT DE BOUT EN BOUT — Comment ça marche ?        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ÉTAPE 1 : GÉNÉRATION DES CLÉS (à la connexion)             ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │  Alice génère :                Bob génère :            │ ║
║  │  🔑 Clé publique RSA          🔑 Clé publique RSA     │ ║
║  │  🔐 Clé privée RSA            🔐 Clé privée RSA       │ ║
║  │  (stockée localement)         (stockée localement)     │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ÉTAPE 2 : ÉCHANGE DE CLÉS (via serveur)                    ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │  Alice ──► [Clé publique Alice] ──► Serveur ──► Bob   │ ║
║  │  Bob   ──► [Clé publique Bob]   ──► Serveur ──► Alice │ ║
║  │                                                        │ ║
║  │  Bob génère clé AES-256 (session)                     │ ║
║  │  Bob chiffre clé AES avec RSA publique d'Alice        │ ║
║  │  Bob ──► [Clé AES chiffrée] ──► Serveur ──► Alice     │ ║
║  │  Alice déchiffre avec sa clé RSA privée               │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ÉTAPE 3 : COMMUNICATION CHIFFRÉE                           ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │  "Bonjour !" ──► AES-GCM ──► "x7Kp9..." ──► Serveur   │ ║
║  │  Serveur ──► "x7Kp9..." ──► AES-GCM ──► "Bonjour !"   │ ║
║  │                                                        │ ║
║  │  ⚠️ Le serveur ne voit que "x7Kp9..." (charabia)      │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "C'est le cœur technique du projet. Laissez-moi vous expliquer comment fonctionne le chiffrement de bout en bout, étape par étape.
> 
> **Étape 1 — Génération des clés.** Quand Alice ouvre l'application, son navigateur génère automatiquement une paire de clés RSA : une clé publique qu'elle peut partager, et une clé privée qui reste stockée uniquement sur son appareil. Bob fait exactement la même chose de son côté.
> 
> **Étape 2 — Échange de clés.** Alice et Bob s'échangent leurs clés publiques via le serveur. Ces clés publiques ne sont pas secrètes, elles peuvent circuler librement. Ensuite, Bob génère une clé de session AES-256, qui servira à chiffrer tous les messages. Il chiffre cette clé AES avec la clé publique RSA d'Alice, et l'envoie. Seule Alice peut la déchiffrer avec sa clé privée. À ce stade, Alice et Bob partagent un secret — la clé AES — sans que le serveur ne l'ait jamais vu en clair.
> 
> **Étape 3 — Communication.** Tous les messages sont chiffrés avec AES-GCM avant d'être envoyés. Le serveur ne reçoit que du charabia incompréhensible. Il transmet ce charabia à l'autre utilisateur, qui le déchiffre avec la clé AES partagée.
> 
> Le point clé : même si le serveur est compromis, même si quelqu'un intercepte le trafic réseau, les messages restent illisibles car la clé AES n'est jamais transmise en clair."

---

## 🎬 SLIDE 7 : Code source — Chiffrement (2 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  💻 IMPLÉMENTATION — Extraits de code                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📁 service/src/cryptoRSA.ts — Génération des clés RSA      ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ async function generateRSAKeyPair() {                  │ ║
║  │   const algorithm = {                                  │ ║
║  │     name: 'RSA-OAEP',                                  │ ║
║  │     modulusLength: 2048,        // Taille de clé      │ ║
║  │     publicExponent: new Uint8Array([0x01, 0x00, 0x01]),│ ║
║  │     hash: 'SHA-256',            // Fonction de hash   │ ║
║  │   };                                                   │ ║
║  │   return crypto.subtle.generateKey(algorithm, true,   │ ║
║  │     ['encrypt', 'decrypt']);                          │ ║
║  │ }                                                      │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  📁 service/src/cryptoAES.ts — Chiffrement des messages     ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ async generateKey() {                                  │ ║
║  │   return crypto.subtle.generateKey(                   │ ║
║  │     { name: "AES-GCM", length: 256 },                 │ ║
║  │     true, ["encrypt", "decrypt"]                      │ ║
║  │   );                                                   │ ║
║  │ }                                                      │ ║
║  │                                                        │ ║
║  │ async encrypt(plaintext, key) {                       │ ║
║  │   const iv = crypto.getRandomValues(new Uint8Array(12));│ ║
║  │   const ciphertext = await crypto.subtle.encrypt(     │ ║
║  │     { name: "AES-GCM", iv }, key, plaintext           │ ║
║  │   );                                                   │ ║
║  │   return { iv, ciphertext };  // IV unique par msg    │ ║
║  │ }                                                      │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Voici des extraits de code montrant l'implémentation concrète.
> 
> **Pour RSA** : j'utilise `crypto.subtle.generateKey` avec l'algorithme RSA-OAEP. La taille de clé est de 2048 bits, ce qui est le standard actuel. Le hash utilisé est SHA-256.
> 
> **Pour AES** : la clé fait 256 bits, le maximum pour AES. J'utilise le mode GCM qui fournit à la fois confidentialité et intégrité — il détecte si le message a été modifié. Chaque message utilise un IV (vecteur d'initialisation) aléatoire de 12 bytes, ce qui garantit que même deux messages identiques produisent des chiffrés différents.
> 
> Tout ceci utilise la WebCrypto API native du navigateur. Pas de librairie externe pour la crypto, ce qui réduit la surface d'attaque."

---

## 🎬 SLIDE 8 : WebRTC — Appels audio/vidéo (2 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  📹 WEBRTC — Appels Audio/Vidéo P2P                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FLUX D'UN APPEL VIDÉO                                      ║
║                                                              ║
║    ALICE                    SERVEUR                  BOB    ║
║      │                         │                       │    ║
║      │  1. Clique "Appeler"    │                       │    ║
║      │  2. getUserMedia()      │                       │    ║
║      │     (caméra + micro)    │                       │    ║
║      │                         │                       │    ║
║      ├──► 3. Offer SDP ───────►│                       │    ║
║      │                         │──► 4. Notif appel ───►│    ║
║      │                         │                       │    ║
║      │                         │    5. 📱 Sonnerie     │    ║
║      │                         │    6. Clique Accepter │    ║
║      │                         │    7. getUserMedia()  │    ║
║      │                         │                       │    ║
║      │◄── 8. Answer SDP ◄──────│◄── Answer SDP ◄───────┤    ║
║      │                         │                       │    ║
║      │◄═══════ ICE Candidates (STUN) ═════════════════►│    ║
║      │                         │                       │    ║
║      │◄════════════════════════════════════════════════►│    ║
║      │         CONNEXION DIRECTE P2P                   │    ║
║      │         Audio/Vidéo (pas via serveur)           │    ║
║      │                                                  │    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Pour les appels audio et vidéo, j'utilise WebRTC, la technologie standard du web pour la communication temps réel.
> 
> Voici le flux d'un appel :
> 
> 1. Alice clique sur 'Appeler'. Son navigateur demande l'accès à la caméra et au micro.
> 2. Alice crée une 'Offer SDP' qui décrit ses capacités (codecs audio/vidéo, résolution, etc.).
> 3. Cette offre est envoyée à Bob via notre serveur Socket.io — c'est le 'signaling'.
> 4. Bob reçoit une notification d'appel entrant avec une sonnerie.
> 5. Quand Bob accepte, son navigateur active aussi sa caméra et son micro.
> 6. Bob crée une 'Answer SDP' qui est renvoyée à Alice.
> 7. Les deux navigateurs échangent des 'ICE Candidates' pour trouver le meilleur chemin réseau.
> 8. Une connexion directe P2P s'établit entre Alice et Bob.
> 
> Point important : une fois la connexion établie, les flux audio et vidéo ne passent plus par notre serveur. C'est une connexion directe entre les deux utilisateurs, ce qui réduit la latence et garantit que nous n'avons aucun accès aux flux média."

---

## 🎬 SLIDE 9 : Fonctionnalités de l'application (2 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  ⭐ FONCTIONNALITÉS                                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  💬 MESSAGERIE                     📞 APPELS                 ║
║  ┌────────────────────────┐       ┌────────────────────────┐║
║  │ ✓ Messages texte       │       │ ✓ Appels audio         │║
║  │ ✓ Emojis               │       │ ✓ Appels vidéo         │║
║  │ ✓ Images               │       │ ✓ Mute/Unmute micro    │║
║  │ ✓ Fichiers (PDF, etc.) │       │ ✓ On/Off caméra        │║
║  │ ✓ Messages vocaux      │       │ ✓ Sonnerie entrante    │║
║  │ ✓ Accusés de réception │       │ ✓ Qualité audio opt.   │║
║  └────────────────────────┘       └────────────────────────┘║
║                                                              ║
║  👥 GROUPES                        🎨 INTERFACE              ║
║  ┌────────────────────────┐       ┌────────────────────────┐║
║  │ ✓ Jusqu'à 100 membres  │       │ ✓ Mode sombre/clair    │║
║  │ ✓ Liste des membres    │       │ ✓ 100% Responsive      │║
║  │ ✓ Notifications join   │       │ ✓ Design moderne       │║
║  │ ✓ Partage de lien      │       │ ✓ Animations fluides   │║
║  └────────────────────────┘       └────────────────────────┘║
║                                                              ║
║  📱 MOBILE                                                   ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ ✓ Application Android native (APK)                     │ ║
║  │ ✓ Permissions caméra/micro                             │ ║
║  │ ✓ Même design que web                                  │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Voici un récapitulatif des fonctionnalités de l'application.
> 
> **Messagerie complète** : messages texte avec emojis, envoi d'images et de fichiers comme des PDF, enregistrement et envoi de messages vocaux, et accusés de réception pour savoir si le message a été délivré.
> 
> **Appels audio et vidéo** : avec la possibilité de couper le micro, désactiver la caméra. J'ai optimisé la qualité audio en désactivant le gain automatique qui causait des problèmes de volume.
> 
> **Groupes** : l'application supporte les conversations de groupe jusqu'à 100 membres, avec une liste visible des participants et des notifications quand quelqu'un rejoint.
> 
> **Interface utilisateur** : design moderne avec mode sombre et clair, entièrement responsive pour s'adapter à toutes les tailles d'écran.
> 
> **Mobile** : j'ai créé une application Android native avec Capacitor. C'est le même code React, packagé en APK avec les permissions caméra et micro configurées."

---

## 🎬 SLIDE 10 : Déploiement (1 minute)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🚀 DÉPLOIEMENT                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │                                                      │   ║
║  │    📦 CODE SOURCE                                    │   ║
║  │         │                                            │   ║
║  │         ▼                                            │   ║
║  │    🔄 GitHub (main branch)                           │   ║
║  │         │                                            │   ║
║  │    ┌────┴────┐                                       │   ║
║  │    ▼         ▼                                       │   ║
║  │  ┌─────┐  ┌─────────┐                               │   ║
║  │  │Render│  │Firebase │                               │   ║
║  │  │     │  │Hosting  │                               │   ║
║  │  └──┬──┘  └────┬────┘                               │   ║
║  │     │          │                                     │   ║
║  │     ▼          ▼                                     │   ║
║  │  Backend    Frontend     ┌──────────┐               │   ║
║  │  Node.js    Static       │ Android  │               │   ║
║  │  + Socket   HTML/JS      │   APK    │               │   ║
║  │  + API      + React      │ (signé)  │               │   ║
║  │                          └──────────┘               │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║  🌐 URLs de production :                                     ║
║  • Backend : https://chat-e2ee.onrender.com                 ║
║  • Frontend : https://chat-e2ee.web.app (Firebase)          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Le déploiement utilise une architecture moderne avec CI/CD.
> 
> Tout le code est sur GitHub. À chaque push sur la branche main, le déploiement est automatique.
> 
> **Le backend** est sur Render, une plateforme cloud qui détecte automatiquement les changements et redéploie. Elle gère Node.js, les WebSockets, et l'API REST.
> 
> **Le frontend** est sur Firebase Hosting, optimisé pour les applications web statiques avec CDN mondial.
> 
> **L'APK Android** est généré localement avec un keystore de signature, prêt pour distribution ou publication sur le Play Store.
> 
> Le tout est automatisé : je code, je push, et quelques minutes plus tard l'application est à jour en production."

---

## 🎬 SLIDE 11 : Démonstration en direct (4-5 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🎥 DÉMONSTRATION EN DIRECT                                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📋 SCÉNARIO DE DÉMO                                         ║
║                                                              ║
║  1️⃣  Création d'un canal de chat                            ║
║      → Générer un lien unique                               ║
║      → Montrer l'URL sécurisée                              ║
║                                                              ║
║  2️⃣  Rejoindre depuis un autre appareil                     ║
║      → Ouvrir le lien dans une autre fenêtre                ║
║      → Montrer la connexion automatique                     ║
║                                                              ║
║  3️⃣  Échange de messages chiffrés                          ║
║      → Envoyer "Bonjour !"                                  ║
║      → Montrer la réception instantanée                     ║
║                                                              ║
║  4️⃣  Appel vidéo                                           ║
║      → Lancer un appel                                      ║
║      → Accepter côté destinataire                           ║
║      → Montrer les contrôles (mute, caméra)                 ║
║                                                              ║
║  5️⃣  Version mobile                                        ║
║      → Ouvrir l'APK sur téléphone (ou DevTools mobile)     ║
║      → Montrer le responsive design                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral (pendant la démo)
> "Passons maintenant à la démonstration.
> 
> **[Action 1]** Je vais d'abord créer un nouveau canal de chat. Vous voyez qu'un lien unique est généré. Ce lien contient un identifiant aléatoire qui identifie le canal de conversation.
> 
> **[Action 2]** Je copie ce lien et l'ouvre dans une deuxième fenêtre, simulant un deuxième utilisateur. Vous voyez que la connexion s'établit automatiquement et les deux utilisateurs sont maintenant dans le même canal.
> 
> **[Action 3]** J'envoie un message 'Bonjour !' depuis la première fenêtre. Vous voyez qu'il apparaît instantanément dans la deuxième. Ce message a été chiffré sur mon navigateur, transmis au serveur sous forme chiffrée, puis déchiffré uniquement sur le navigateur destinataire.
> 
> **[Action 4]** Maintenant je lance un appel vidéo. La sonnerie retentit côté destinataire. J'accepte l'appel et vous voyez les deux flux vidéo. Je peux couper mon micro... réactiver... désactiver ma caméra... Cette connexion est directe entre les deux navigateurs.
> 
> **[Action 5]** Enfin, je réduis la fenêtre pour montrer le responsive design. L'interface s'adapte parfaitement aux petits écrans, comme sur un smartphone."

---

## 🎬 SLIDE 12 : Sécurité — Analyse des risques (2 minutes)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🛡️ ANALYSE DE SÉCURITÉ                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ✅ PROTECTIONS IMPLÉMENTÉES                                 ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ • Chiffrement E2E (RSA-2048 + AES-256-GCM)             │ ║
║  │ • Clés générées côté client uniquement                 │ ║
║  │ • HTTPS obligatoire (TLS 1.3)                          │ ║
║  │ • Pas de stockage de messages côté serveur             │ ║
║  │ • Rate limiting contre les attaques DDoS               │ ║
║  │ • Validation des entrées côté serveur                  │ ║
║  │ • CORS configuré strictement                           │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ⚠️ LIMITES ET RISQUES RÉSIDUELS                            ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ • Confiance dans le code JavaScript servi              │ ║
║  │   → Mitigation : audit de code, SRI                    │ ║
║  │                                                        │ ║
║  │ • Man-in-the-middle sur l'échange de clés publiques   │ ║
║  │   → Mitigation : vérification manuelle des clés       │ ║
║  │                                                        │ ║
║  │ • Perte de clé = perte des messages                   │ ║
║  │   → C'est voulu : pas de backdoor                      │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Parlons maintenant de la sécurité, car c'est le cœur du projet.
> 
> **Protections implémentées** : chiffrement de bout en bout avec des algorithmes standards et robustes. Les clés ne quittent jamais le navigateur de l'utilisateur. Toutes les communications passent par HTTPS. Le serveur n'enregistre pas les messages — ils existent uniquement pendant la session. J'ai aussi implémenté du rate limiting pour éviter les abus.
> 
> **Limites honnêtes** : comme toute application web, l'utilisateur doit faire confiance au JavaScript qui lui est servi. Un attaquant contrôlant le serveur pourrait théoriquement servir un code malveillant. C'est une limite inhérente aux applications web — les solutions sont l'audit de code et les applications natives.
> 
> Deuxième limite : l'échange initial de clés publiques passe par le serveur. Un attaquant en position de man-in-the-middle pourrait substituer sa propre clé. La solution serait une vérification manuelle des empreintes de clés, comme le fait Signal.
> 
> Enfin, si un utilisateur perd son appareil ou efface ses données, il perd ses clés et donc l'accès aux messages. C'est un choix de design : pas de backdoor, pas de récupération possible."

---

## 🎬 SLIDE 13 : Défis rencontrés (1 minute 30)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🧗 DÉFIS TECHNIQUES RENCONTRÉS                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ❌ PROBLÈME 1 : Caméra du destinataire ne s'activait pas   ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ Cause : getUserMedia() appelé seulement pour l'appelant│ ║
║  │ Solution : Ajout de ensureLocalMedia() à l'acceptation │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ❌ PROBLÈME 2 : Audio inaudible ou trop faible             ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ Cause : autoGainControl du navigateur trop agressif    │ ║
║  │ Solution : Désactivation explicite dans les contraintes│ ║
║  │            { audio: { autoGainControl: false } }       │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ❌ PROBLÈME 3 : APK affichait "Not Found"                  ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ Cause : Capacitor cherchait localhost au lieu du       │ ║
║  │         serveur de production                          │ ║
║  │ Solution : Configuration .env.production avec URL      │ ║
║  │            REACT_APP_SERVER_URL correcte               │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Comme tout projet de développement, j'ai rencontré plusieurs défis techniques.
> 
> **Premier problème** : lors des appels vidéo, seul l'appelant voyait sa caméra, pas le destinataire. Après analyse, j'ai découvert que `getUserMedia()` n'était appelé que pour l'initiateur de l'appel. J'ai ajouté une méthode `ensureLocalMedia()` qui s'exécute automatiquement quand on accepte un appel.
> 
> **Deuxième problème** : la qualité audio était mauvaise, parfois inaudible. Le coupable était l'option `autoGainControl` du navigateur qui ajustait le volume de façon trop agressive. En la désactivant explicitement, l'audio est devenu clair et stable.
> 
> **Troisième problème** : l'application Android affichait 'Not Found' au démarrage. L'application cherchait à se connecter à `localhost`, qui n'existe pas sur un téléphone. J'ai configuré la variable d'environnement pour pointer vers le serveur de production.
> 
> Chaque problème m'a appris quelque chose sur WebRTC et le développement mobile."

---

## 🎬 SLIDE 14 : Améliorations futures (1 minute)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  🔮 AMÉLIORATIONS FUTURES                                    ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🔜 COURT TERME                                              ║
║  ├── Serveur TURN pour meilleur NAT traversal               ║
║  ├── Indicateurs de frappe (typing indicators)              ║
║  └── Réactions aux messages (emoji)                         ║
║                                                              ║
║  📅 MOYEN TERME                                              ║
║  ├── Application iOS (même codebase Capacitor)              ║
║  ├── Messages éphémères (auto-destruction)                  ║
║  ├── Vérification des empreintes de clés                    ║
║  └── Partage d'écran dans les appels                        ║
║                                                              ║
║  🚀 LONG TERME                                               ║
║  ├── Protocole Signal pour double ratchet                   ║
║  ├── Stockage chiffré persistant (IndexedDB)                ║
║  ├── Backup chiffré des clés                                ║
║  └── Publication sur Play Store / App Store                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Pour conclure sur le technique, voici les améliorations que j'envisage.
> 
> **À court terme** : ajouter un serveur TURN pour les cas où la connexion P2P directe échoue à cause des pare-feux. Ajouter des indicateurs de frappe et des réactions aux messages.
> 
> **À moyen terme** : créer une version iOS avec le même code Capacitor, implémenter des messages éphémères qui s'auto-détruisent, et permettre la vérification manuelle des empreintes de clés pour contrer les attaques man-in-the-middle.
> 
> **À long terme** : implémenter le protocole Signal avec double ratchet pour une sécurité encore meilleure, ajouter un stockage local chiffré pour l'historique, et publier sur les stores officiels."

---

## 🎬 SLIDE 15 : Conclusion (1 minute)

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║  📝 CONCLUSION                                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ✅ OBJECTIFS ATTEINTS                                       ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ ✓ Application de chat fonctionnelle et déployée        │ ║
║  │ ✓ Chiffrement E2E véritablement implémenté             │ ║
║  │ ✓ Appels audio/vidéo P2P opérationnels                 │ ║
║  │ ✓ Version mobile Android disponible                    │ ║
║  │ ✓ Code propre, typé et testé                           │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  💡 CE QUE J'AI APPRIS                                       ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │ • Cryptographie appliquée (RSA, AES, WebCrypto)        │ ║
║  │ • WebRTC et communication temps réel                   │ ║
║  │ • Architecture fullstack moderne                       │ ║
║  │ • Développement mobile cross-platform                  │ ║
║  │ • Déploiement cloud et CI/CD                           │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  🔐 "La vie privée n'est pas une option, c'est un droit."   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Script oral
> "Pour conclure, tous les objectifs que je m'étais fixés ont été atteints.
> 
> L'application est fonctionnelle et déployée. Le chiffrement de bout en bout est réellement implémenté — ce n'est pas juste un label marketing. Les appels audio et vidéo fonctionnent en peer-to-peer. L'application mobile Android est disponible.
> 
> Ce projet m'a énormément appris : la cryptographie appliquée avec WebCrypto, WebRTC et les subtilités de la communication temps réel, l'architecture fullstack moderne avec React et Node.js, et le développement mobile cross-platform avec Capacitor.
> 
> Je terminerai par cette citation : 'La vie privée n'est pas une option, c'est un droit.' C'est ce qui a motivé ce projet.
> 
> Je vous remercie pour votre attention et je suis disponible pour vos questions."

---

## 🎬 SLIDE 16 : Questions & Réponses

### Contenu visuel
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                     ❓ QUESTIONS ?                           ║
║                                                              ║
║  ─────────────────────────────────────────────────────────  ║
║                                                              ║
║                      Ahmed Amine Bejaoui                     ║
║                                                              ║
║           📧 [votre email]                                   ║
║           🔗 github.com/AhmedAmineBejaoui/chat-e2ee         ║
║                                                              ║
║  ─────────────────────────────────────────────────────────  ║
║                                                              ║
║                     Merci de votre attention !               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

# 📋 QUESTIONS FRÉQUENTES ANTICIPÉES

## Q1: "Pourquoi ne pas utiliser Signal directement ?"
> "Signal est excellent, mais c'est une application fermée. Mon objectif était éducatif : comprendre et implémenter moi-même les mécanismes de chiffrement. De plus, Chat E2EE est web-first — accessible depuis n'importe quel navigateur sans installation."

## Q2: "Le serveur pourrait-il être modifié pour voler les clés ?"
> "Le serveur ne reçoit jamais les clés privées ni la clé de session AES en clair. Il ne voit que des clés publiques (qui sont publiques par définition) et la clé AES chiffrée avec RSA. Sans la clé privée RSA du destinataire, impossible de déchiffrer."

## Q3: "Que se passe-t-il si le serveur est piraté ?"
> "L'attaquant obtiendrait : la liste des canaux actifs, les clés publiques, et des messages chiffrés illisibles. Il ne pourrait pas lire le contenu des messages car il n'a pas les clés de déchiffrement."

## Q4: "Pourquoi AES-GCM plutôt qu'AES-CBC ?"
> "GCM fournit l'authentification en plus du chiffrement. Il garantit que le message n'a pas été modifié. CBC ne fournit que la confidentialité. GCM est aussi plus performant car parallélisable."

## Q5: "Comment gérez-vous les groupes avec E2E ?"
> "Actuellement, chaque paire d'utilisateurs dans le groupe partage une clé de session. Pour une vraie sécurité de groupe, il faudrait implémenter un protocole comme Sender Keys (utilisé par Signal). C'est prévu pour une version future."

## Q6: "L'application est-elle prête pour la production ?"
> "Elle est fonctionnelle et déployée, mais pour une utilisation à grande échelle, il faudrait : un audit de sécurité professionnel, un serveur TURN pour le NAT traversal, et une infrastructure plus robuste pour gérer la charge."

---

# ⏱️ TIMING RECOMMANDÉ

| Slide | Contenu | Durée | Cumul |
|-------|---------|-------|-------|
| 1 | Titre | 0:30 | 0:30 |
| 2 | Contexte | 2:00 | 2:30 |
| 3 | Objectifs | 1:30 | 4:00 |
| 4 | Architecture | 3:00 | 7:00 |
| 5 | Stack | 1:30 | 8:30 |
| 6 | Chiffrement E2E | 4:00 | 12:30 |
| 7 | Code | 2:00 | 14:30 |
| 8 | WebRTC | 2:00 | 16:30 |
| 9 | Fonctionnalités | 2:00 | 18:30 |
| 10 | Déploiement | 1:00 | 19:30 |
| 11 | **DÉMO** | 5:00 | 24:30 |
| 12 | Sécurité | 2:00 | 26:30 |
| 13 | Défis | 1:30 | 28:00 |
| 14 | Améliorations | 1:00 | 29:00 |
| 15 | Conclusion | 1:00 | 30:00 |
| 16 | Q&A | 5:00+ | 35:00+ |

**Total : ~30 minutes + Q&A**

---

# 🎯 CONSEILS DE PRÉSENTATION

1. **Avant la présentation**
   - Tester la démo complète 2-3 fois
   - Avoir un backup vidéo de la démo en cas de problème réseau
   - Préparer 2 navigateurs/fenêtres pour la démo
   - Vérifier caméra et micro fonctionnels

2. **Pendant la présentation**
   - Parler lentement et clairement
   - Regarder l'audience, pas seulement les slides
   - Pour la démo, narrer chaque action avant de la faire
   - Ne pas paniquer si quelque chose ne marche pas — expliquer le comportement attendu

3. **Pour les questions**
   - Répondre honnêtement, y compris "je ne sais pas, mais..."
   - Rediriger vers les slides si la réponse y figure
   - Proposer d'approfondir après la présentation si complexe

---

*Document préparé le 12 décembre 2025*
