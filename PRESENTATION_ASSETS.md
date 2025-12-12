# 📊 Assets de Présentation — Chat E2EE

Ce document contient les visuels (diagrammes) et le script de démonstration pour la présentation PowerPoint.

---

## 🖼️ VISUELS & DIAGRAMMES

### 1. Diagramme d'Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CHAT E2EE - ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐                              ┌──────────────────┐
    │   CLIENT A       │                              │   CLIENT B       │
    │  (React + TS)    │                              │  (React + TS)    │
    │                  │                              │                  │
    │ ┌──────────────┐ │                              │ ┌──────────────┐ │
    │ │ WebCrypto    │ │                              │ │ WebCrypto    │ │
    │ │ - RSA-OAEP   │ │                              │ │ - RSA-OAEP   │ │
    │ │ - AES-GCM    │ │                              │ │ - AES-GCM    │ │
    │ └──────────────┘ │                              │ └──────────────┘ │
    │                  │                              │                  │
    │ ┌──────────────┐ │    Media Stream (P2P)       │ ┌──────────────┐ │
    │ │   WebRTC     │◄├─────────────────────────────►┤ │   WebRTC     │ │
    │ │ getUserMedia │ │   Audio/Video chiffrés      │ │ getUserMedia │ │
    │ └──────────────┘ │                              │ └──────────────┘ │
    └────────┬─────────┘                              └────────┬─────────┘
             │                                                  │
             │ Socket.io                              Socket.io │
             │ (Signaling)                          (Signaling) │
             │                                                  │
             ▼                                                  ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                        SERVEUR NODE.JS                              │
    │                                                                     │
    │   ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐  │
    │   │   Socket.io     │    │    Express      │    │   In-Memory   │  │
    │   │   - Signaling   │    │    REST API     │    │   Database    │  │
    │   │   - Events      │    │    - Channels   │    │   (Channels)  │  │
    │   └─────────────────┘    └─────────────────┘    └───────────────┘  │
    │                                                                     │
    │   ⚠️ Le serveur ne voit JAMAIS les clés de chiffrement             │
    │      ni le contenu des messages (E2EE)                              │
    └─────────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │                      SERVICES EXTERNES                              │
    │                                                                     │
    │   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐   │
    │   │ STUN Server │    │ Firebase    │    │   Image Upload      │   │
    │   │ (Google)    │    │ Hosting     │    │   (imgbb/imgur)     │   │
    │   └─────────────┘    └─────────────┘    └─────────────────────┘   │
    └─────────────────────────────────────────────────────────────────────┘
```

---

### 2. Flux de Chiffrement E2EE (Échange de clés)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUX DE CHIFFREMENT E2EE                                │
└─────────────────────────────────────────────────────────────────────────────┘

     CLIENT A                    SERVEUR                    CLIENT B
        │                           │                           │
        │  1. Génère paire RSA      │                           │
        │  (publicKey, privateKey)  │                           │
        │                           │                           │
        ├──► 2. Envoie publicKey ──►│                           │
        │                           │──► 3. Transmet publicKey─►│
        │                           │                           │
        │                           │   4. B génère clé AES-256 │
        │                           │   (session key)           │
        │                           │                           │
        │                           │◄── 5. Chiffre AES key ◄───┤
        │◄── 6. Transmet encrypted──│    avec RSA publicKey A   │
        │        AES key            │                           │
        │                           │                           │
        │  7. Déchiffre AES key     │                           │
        │     avec RSA privateKey   │                           │
        │                           │                           │
   ═════╪═══════════════════════════╪═══════════════════════════╪═════════════
        │                           │                           │
        │    🔐 COMMUNICATION CHIFFRÉE AES-GCM 🔐              │
        │                           │                           │
        ├──► Message chiffré AES ──►│──► Message chiffré ──────►│
        │                           │                           │
        │◄── Message chiffré ◄──────│◄── Message chiffré AES ◄──┤
        │                           │                           │
        │  ⚠️ Serveur ne voit que   │                           │
        │     des données chiffrées │                           │
        │                           │                           │
```

---

### 3. Flux WebRTC (Appel Audio/Vidéo)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUX WEBRTC - APPEL AUDIO/VIDEO                         │
└─────────────────────────────────────────────────────────────────────────────┘

     APPELANT (A)                SERVEUR                    APPELÉ (B)
        │                           │                           │
        │  1. Clique "Appeler"      │                           │
        │                           │                           │
        │  2. getUserMedia()        │                           │
        │  → Caméra + Micro ON      │                           │
        │                           │                           │
        │  3. createOffer()         │                           │
        │                           │                           │
        ├──► 4. Offer SDP ─────────►│                           │
        │                           │──► 5. call-user event ───►│
        │                           │                           │
        │                           │    6. 📱 Sonnerie         │
        │                           │    "Incoming call..."     │
        │                           │                           │
        │                           │    7. Clique "Accepter"   │
        │                           │                           │
        │                           │    8. ensureLocalMedia()  │
        │                           │    → Caméra + Micro ON    │
        │                           │                           │
        │                           │    9. createAnswer()      │
        │                           │                           │
        │◄── 10. Answer SDP ◄───────│◄── Answer SDP ◄───────────┤
        │                           │                           │
        │  11. setRemoteDescription │    12. setRemoteDescription
        │                           │                           │
   ═════╪═══════════════════════════╪═══════════════════════════╪═════════════
        │                           │                           │
        │◄─────── ICE Candidates ───┼───────────────────────────►│
        │         (STUN/TURN)       │                           │
        │                           │                           │
   ═════╪═══════════════════════════╪═══════════════════════════╪═════════════
        │                                                       │
        │◄═══════════════ MEDIA P2P DIRECT ═══════════════════►│
        │        Audio/Video Stream (pas via serveur)           │
        │                                                       │
```

---

### 4. Structure des Composants React

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STRUCTURE COMPOSANTS REACT                            │
└─────────────────────────────────────────────────────────────────────────────┘

    src/
    ├── pages/
    │   └── messaging/
    │       └── index.tsx ─────────────────┐
    │           │                          │
    │           ├── État: messages, call   │
    │           ├── WebRTC: e2eCall        │
    │           └── Socket.io: events      │
    │                                      │
    └── components/                        │
        └── Messaging/                     │
            │                              ▼
            ├── Message.tsx ◄────── Affiche un message (texte/image/audio)
            │   └── MessageBubble.tsx      │
            │                              │
            ├── NewMessageForm.tsx ◄───── Formulaire d'envoi
            │   ├── FilePicker/            │
            │   └── AudioRecorder.tsx      │
            │                              │
            ├── CallOverlay.tsx ◄──────── Interface d'appel (vidéo/audio)
            │   └── CallOverlay.module.css │
            │                              │
            ├── GroupMembersList.tsx ◄──── Liste membres du groupe
            │                              │
            └── ScrollWrapper.tsx ◄─────── Container scrollable des messages

    ┌─────────────────────────────────────────────────────────────────────┐
    │  service/src/                                                       │
    │  ├── webrtc.ts ────────── Gestion complète WebRTC (offer/answer)   │
    │  ├── cryptoAES.ts ─────── Chiffrement symétrique AES-GCM           │
    │  ├── cryptoRSA.ts ─────── Chiffrement asymétrique RSA-OAEP         │
    │  └── sdk.ts ───────────── SDK client (getLink, sendMessage, etc.)  │
    └─────────────────────────────────────────────────────────────────────┘
```

---

### 5. Capture d'écran recommandées (liste)

| N° | Capture | Fichier source | Description |
|----|---------|----------------|-------------|
| 1 | Page de messagerie | `client/src/pages/messaging/index.tsx` | Vue principale avec header, messages, formulaire |
| 2 | Overlay d'appel | `client/src/components/Messaging/CallOverlay.tsx` | Interface vidéo avec boutons mute/hangup |
| 3 | Liste des membres | `client/src/components/Messaging/GroupMembersList.tsx` | Panel latéral/bottom-sheet des membres |
| 4 | Formulaire de message | `client/src/components/Messaging/NewMessageForm.tsx` | Input + boutons fichier/audio/envoi |
| 5 | Vue mobile | Navigateur en 375px | Démontrer le responsive |
| 6 | Vue tablette | Navigateur en 768px | Démontrer le responsive |

---

## 🎬 SCRIPT DE DÉMONSTRATION (3-4 minutes)

### Pré-requis

Avant de commencer la démo :

```bash
# Terminal 1 : Lancer le serveur + client
cd "c:\Users\Ahmed Amin Bejoui\Desktop\chat-e2ee"
npm run dev

# Attendre que les deux services soient prêts :
# - [1] Server running at 3001 (https)
# - [0] Compiled successfully
```

Ouvrir 2 fenêtres de navigateur (ou 2 onglets) :
- **Fenêtre A** : `https://localhost:3000` (Utilisateur A - Appelant)
- **Fenêtre B** : `https://localhost:3000` (Utilisateur B - Appelé)

---

### Étape 1 : Création du canal (30 secondes)

**Actions :**
1. Dans **Fenêtre A**, cliquer sur "Create Chat Link" ou "New Chat"
2. Un lien unique est généré (ex: `https://localhost:3000/chat/abc123xyz`)
3. **Copier le lien** affiché

**Script oral :**
> "Je crée un nouveau canal de chat. L'application génère un lien unique et sécurisé. Ce lien sera partagé avec mon interlocuteur."

---

### Étape 2 : Rejoindre le canal (30 secondes)

**Actions :**
1. Dans **Fenêtre B**, **coller le lien** dans la barre d'adresse
2. Observer que les deux utilisateurs sont maintenant connectés
3. Montrer que le compteur de membres affiche "2/2" (mode privé)

**Script oral :**
> "L'utilisateur B rejoint le canal via le lien. La connexion Socket.io s'établit et les clés publiques sont échangées automatiquement pour le chiffrement E2EE."

---

### Étape 3 : Envoi de messages chiffrés (45 secondes)

**Actions :**
1. **Fenêtre A** : Taper un message "Bonjour ! 👋" et envoyer
2. **Fenêtre B** : Observer le message reçu
3. **Fenêtre B** : Répondre "Salut ! Tout est chiffré de bout en bout 🔐"
4. Montrer les bulles de messages avec leurs styles différents (envoyé vs reçu)

**Script oral :**
> "Les messages sont chiffrés avec AES-256-GCM avant d'être envoyés. Le serveur ne voit jamais le contenu en clair, seulement des données chiffrées. Seuls les participants possèdent la clé de session."

---

### Étape 4 : Lancer un appel vidéo (1 minute)

**Actions :**
1. **Fenêtre A** : Cliquer sur l'icône **📹 Vidéo** (bouton d'appel vidéo)
2. Observer l'overlay d'appel qui s'affiche avec la vidéo locale
3. **Fenêtre B** : L'interface affiche "Incoming Video Call..." avec sonnerie
4. **Fenêtre B** : Cliquer sur **"Accept"**
5. Observer :
   - Les deux vidéos s'affichent (local + remote)
   - La qualité audio est claire (autoGainControl désactivé)

**Script oral :**
> "Je lance un appel vidéo. Le signaling passe par Socket.io, mais le flux média est en peer-to-peer direct via WebRTC. Quand B accepte, sa caméra s'ouvre automatiquement grâce à notre correction ensureLocalMedia(). Le son est optimisé pour éviter les problèmes de gain automatique."

---

### Étape 5 : Fonctionnalités d'appel (30 secondes)

**Actions :**
1. **Fenêtre A** : Cliquer sur **🎤 Mute** pour couper le micro
2. Observer l'icône qui change (micro barré)
3. **Fenêtre A** : Cliquer sur **📹 Camera Off** pour couper la vidéo
4. **Fenêtre A** : Cliquer sur **📞 Raccrocher** pour terminer l'appel

**Script oral :**
> "Pendant l'appel, on peut mute le micro, désactiver la caméra, ou raccrocher. Ces contrôles agissent directement sur les tracks WebRTC."

---

### Étape 6 : Responsive Design (30 secondes)

**Actions :**
1. Ouvrir les **DevTools** (F12) dans une des fenêtres
2. Activer le mode **Responsive** (icône téléphone/tablette)
3. Sélectionner **iPhone 12 Pro** ou redimensionner à **375px**
4. Montrer que :
   - L'interface s'adapte (menu, messages, formulaire)
   - Les membres s'affichent en bottom-sheet au lieu d'un panel latéral
   - Les boutons restent accessibles

**Script oral :**
> "L'application est entièrement responsive. Sur mobile, l'interface s'adapte automatiquement avec des breakpoints à 480px, 768px et 1024px. La liste des membres devient un bottom-sheet glissant."

---

### Étape 7 : Conclusion (15 secondes)

**Actions :**
1. Revenir à la vue desktop
2. Fermer les DevTools

**Script oral :**
> "En résumé : messagerie temps réel chiffrée de bout en bout, appels audio/vidéo P2P via WebRTC, et une interface responsive. Le serveur ne stocke rien et n'a jamais accès au contenu. Questions ?"

---

## 📝 NOTES TECHNIQUES POUR Q&A

### Questions fréquentes anticipées :

**Q: Comment garantissez-vous que le serveur ne peut pas lire les messages ?**
> R: Les clés de chiffrement sont générées et stockées uniquement côté client (WebCrypto API). Le serveur reçoit uniquement des données déjà chiffrées. Même si le serveur était compromis, il ne pourrait pas déchiffrer les messages.

**Q: Que se passe-t-il si un utilisateur perd sa clé privée ?**
> R: Les messages précédents deviennent inaccessibles. C'est le compromis du E2EE véritable. Une amélioration future pourrait inclure un système de backup chiffré des clés.

**Q: Pourquoi WebRTC plutôt qu'un serveur média ?**
> R: WebRTC permet une connexion P2P directe, réduisant la latence et la bande passante serveur. Les flux média ne transitent jamais par notre serveur (sauf si TURN est nécessaire pour NAT traversal).

**Q: L'application fonctionne-t-elle sans connexion internet stable ?**
> R: WebRTC utilise des mécanismes ICE pour trouver le meilleur chemin réseau. En cas de connexion instable, il peut fallback sur un serveur TURN. Les messages texte passent par Socket.io qui gère les reconnexions automatiquement.

---

## 📁 FICHIERS CLÉS À MONTRER (optionnel)

Si vous souhaitez montrer du code pendant la présentation :

### 1. Chiffrement AES (`service/src/cryptoAES.ts`)
```typescript
// Génération de clé AES-256
const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
);
```

### 2. Chiffrement RSA (`service/src/cryptoRSA.ts`)
```typescript
// Génération paire RSA pour échange de clés
const algorithm: RsaHashedKeyGenParams = {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: 'SHA-256',
};
```

### 3. WebRTC - Activation caméra (`service/src/webrtc.ts`)
```typescript
// Correction : active la caméra pour l'appelé
async ensureLocalMedia(withVideo = true) {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: { autoGainControl: false }, // Meilleure qualité audio
        video: withVideo
    });
    // ... reste du code
}
```

---

*Document généré le 11 décembre 2025 pour la présentation Chat E2EE*
