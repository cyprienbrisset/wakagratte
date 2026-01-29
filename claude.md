# Wakagratte - Configuration Claude Code

## Description du projet

Wakagratte est une application web interactive pour apprendre la guitare via des "cheat codes" - des séquences de notes visualisées comme des codes secrets à exécuter. L'application utilise le micro pour détecter les notes jouées en temps réel.

## Stack Technique

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5.7+**
- **Tailwind CSS 4**

### Audio
- **Web Audio API** native
- **pitchy** pour la détection de pitch
- **Tone.js** pour la synthèse audio (feedback sonore)

### Stockage (MVP)
- **localStorage** pour les préférences
- **IndexedDB** pour les données de progression

## Architecture

```
src/
├── app/                    # App Router Next.js
│   ├── layout.tsx
│   ├── page.tsx           # Landing page
│   ├── tuner/             # Page accordeur
│   ├── play/              # Page de jeu
│   │   └── [cheatId]/     # Cheat code spécifique
│   └── globals.css
├── components/
│   ├── ui/                # Composants UI réutilisables
│   ├── tuner/             # Composants accordeur
│   │   ├── TunerDial.tsx
│   │   ├── NoteIndicator.tsx
│   │   └── TuningSelector.tsx
│   ├── fretboard/         # Visualisation manche
│   │   ├── Fretboard.tsx
│   │   ├── String.tsx
│   │   └── Fret.tsx
│   ├── cheatcode/         # Affichage cheat codes
│   │   ├── CheatCodeDisplay.tsx
│   │   ├── SequenceProgress.tsx
│   │   └── NoteMarker.tsx
│   └── feedback/          # Feedback visuel/sonore
│       ├── SuccessAnimation.tsx
│       └── ErrorShake.tsx
├── hooks/
│   ├── useAudioContext.ts
│   ├── usePitchDetection.ts
│   ├── useMicrophone.ts
│   └── useCheatCodeValidation.ts
├── lib/
│   ├── audio/
│   │   ├── pitchDetector.ts
│   │   └── noteMapper.ts
│   ├── music/
│   │   ├── notes.ts       # Fréquences, noms de notes
│   │   ├── tunings.ts     # Accordages
│   │   └── cheatCodes.ts  # Définitions des cheat codes
│   └── utils/
│       └── storage.ts
├── data/
│   └── cheatcodes.json    # Bibliothèque de cheat codes
└── types/
    ├── audio.ts
    ├── music.ts
    └── cheatcode.ts
```

## Conventions de code

### TypeScript
- Strict mode activé
- Interfaces préférées aux types pour les objets
- Enums pour les états finis (NoteState, ValidationState)

### Composants React
- Composants fonctionnels uniquement
- Custom hooks pour la logique réutilisable
- Props typées avec interfaces dédiées

### Nommage
- **Fichiers composants**: PascalCase (ex: `TunerDial.tsx`)
- **Hooks**: camelCase avec préfixe `use` (ex: `usePitchDetection.ts`)
- **Utilitaires**: camelCase (ex: `noteMapper.ts`)
- **Types/Interfaces**: PascalCase avec suffixe descriptif (ex: `CheatCodeSequence`)

### Styles
- Tailwind CSS pour tous les styles
- Classes utilitaires en priorité
- Animations via Tailwind + CSS custom pour les complexes
- Variables CSS pour les couleurs du thème

## Types principaux

```typescript
interface CheatCode {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tempo: number;
  sequence: NoteStep[];
}

interface NoteStep {
  string: 1 | 2 | 3 | 4 | 5 | 6;
  fret: number;
  duration?: number;
}

type NoteState = 'waiting' | 'active' | 'success' | 'error';

interface DetectedNote {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  clarity: number;
}

type Tuning = 'standard' | 'dropD' | 'openG' | 'openD' | 'custom';
```

## Constantes musicales

```typescript
// Fréquences standard (A4 = 440Hz)
const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

// Mapping note -> fréquence
const NOTE_FREQUENCIES: Record<string, number> = {
  'E2': 82.41,
  'A2': 110.00,
  'D3': 146.83,
  'G3': 196.00,
  'B3': 246.94,
  'E4': 329.63,
  // ... autres notes
};
```

## Instructions de développement

### Priorités MVP
1. Accordeur fonctionnel avec détection de pitch précise
2. Visualisation du manche de guitare interactive
3. 3 cheat codes jouables
4. Feedback visuel clair (succès/erreur)

### Performance
- Utiliser `requestAnimationFrame` pour les animations audio
- Web Workers pour le traitement audio si nécessaire
- Optimiser le re-render avec `useMemo` et `useCallback`

### Accessibilité
- Labels ARIA pour les contrôles
- Support clavier complet
- Contraste suffisant pour les indicateurs

### Mobile
- Design responsive (mobile-first)
- Touch events pour les interactions
- Gestion permissions micro sur iOS/Android

## Commandes

```bash
# Développement
npm run dev

# Build
npm run build

# Lint
npm run lint

# Tests
npm run test
```

## Variables d'environnement

Aucune variable d'environnement requise pour le MVP (tout est côté client).

## Notes importantes

- La détection de pitch nécessite HTTPS en production (getUserMedia)
- Tester sur différents navigateurs (Chrome/Firefox/Safari)
- Prévoir un fallback si le micro n'est pas disponible
- Le timing de validation doit être tolérant (±100ms)
