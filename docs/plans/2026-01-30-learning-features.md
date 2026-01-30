# Learning Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter Wait Mode, Loop, Tempo ajustable, plus de cheat codes, et système de score/stats.

**Architecture:** Étendre `useCheatCodeValidation` avec des modes de jeu. Ajouter un composant de contrôles pour tempo/loop. Stocker les stats en localStorage.

**Tech Stack:** React hooks, localStorage, Web Audio API (métronome via Tone.js optionnel)

---

## Task 1: Wait Mode

Actuellement, l'app valide automatiquement dès qu'une note correcte est détectée. Le Wait Mode est déjà le comportement par défaut. Ce qu'il manque : un indicateur visuel que l'app "attend" et ne fait rien tant que la bonne note n'est pas jouée.

**Files:**
- Modify: `src/hooks/useCheatCodeValidation.ts`
- Modify: `src/app/play/[cheatId]/page.tsx`

**Step 1: Ajouter un état "waitingForNote" dans le hook**

Dans `src/hooks/useCheatCodeValidation.ts`, ajouter un état pour indiquer qu'on attend la note :

```typescript
// Ajouter dans l'interface de retour
interface UseCheatCodeValidationReturn {
  // ... existants
  isWaitingForNote: boolean;
}

// Ajouter l'état
const [isWaitingForNote, setIsWaitingForNote] = useState(true);

// Dans validateNote, mettre à jour :
// - setIsWaitingForNote(false) quand on valide
// - puis setIsWaitingForNote(true) après un court délai

// Retourner isWaitingForNote
```

**Step 2: Afficher l'indicateur visuel dans la page de jeu**

Dans `src/app/play/[cheatId]/page.tsx`, afficher un indicateur pulsant quand `isWaitingForNote` est true.

**Step 3: Tester manuellement**

Lancer l'app, jouer une séquence, vérifier que l'indicateur pulse en attente.

**Step 4: Commit**

```bash
git add src/hooks/useCheatCodeValidation.ts src/app/play/[cheatId]/page.tsx
git commit -m "feat: add wait mode visual indicator"
```

---

## Task 2: Loop Function

Permettre de sélectionner une portion de la séquence à répéter en boucle.

**Files:**
- Modify: `src/hooks/useCheatCodeValidation.ts`
- Create: `src/components/cheatcode/LoopControls.tsx`
- Modify: `src/app/play/[cheatId]/page.tsx`

**Step 1: Ajouter la logique de loop dans le hook**

Dans `src/hooks/useCheatCodeValidation.ts` :

```typescript
interface UseCheatCodeValidationOptions {
  pitchTolerance?: number;
  timingTolerance?: number;
  loopStart?: number;  // index de début de loop (inclus)
  loopEnd?: number;    // index de fin de loop (inclus)
}

// Dans validateNote, quand on atteint loopEnd+1, revenir à loopStart
// Ajouter un compteur de loops complétés
```

**Step 2: Créer le composant LoopControls**

Créer `src/components/cheatcode/LoopControls.tsx` :

```typescript
interface LoopControlsProps {
  sequenceLength: number;
  loopStart: number | null;
  loopEnd: number | null;
  onLoopChange: (start: number | null, end: number | null) => void;
  loopCount: number;
}

// UI:
// - Toggle pour activer/désactiver le loop
// - Deux sliders ou inputs pour start/end
// - Affichage du nombre de loops complétés
```

**Step 3: Intégrer les contrôles dans la page**

Dans `src/app/play/[cheatId]/page.tsx` :
- Ajouter les états loopStart, loopEnd
- Passer les options au hook
- Afficher LoopControls

**Step 4: Tester manuellement**

Configurer un loop sur 2-3 notes, jouer, vérifier que ça boucle.

**Step 5: Commit**

```bash
git add src/hooks/useCheatCodeValidation.ts src/components/cheatcode/LoopControls.tsx src/app/play/[cheatId]/page.tsx
git commit -m "feat: add loop function for practicing sections"
```

---

## Task 3: Tempo Ajustable / Métronome

Ajouter un métronome avec tempo ajustable pour guider le rythme.

**Files:**
- Create: `src/hooks/useMetronome.ts`
- Create: `src/components/cheatcode/TempoControls.tsx`
- Modify: `src/app/play/[cheatId]/page.tsx`

**Step 1: Créer le hook useMetronome**

Créer `src/hooks/useMetronome.ts` :

```typescript
interface UseMetronomeOptions {
  tempo: number; // BPM
  enabled: boolean;
}

interface UseMetronomeReturn {
  isPlaying: boolean;
  currentBeat: number;
  start: () => void;
  stop: () => void;
  setTempo: (bpm: number) => void;
}

// Utiliser Web Audio API pour générer des clicks
// Oscillator court (10ms) à chaque beat
// Calculer l'intervalle: 60000 / tempo ms
```

**Step 2: Créer le composant TempoControls**

Créer `src/components/cheatcode/TempoControls.tsx` :

```typescript
interface TempoControlsProps {
  tempo: number;
  onTempoChange: (tempo: number) => void;
  isPlaying: boolean;
  onToggle: () => void;
}

// UI:
// - Slider de tempo (40-200 BPM)
// - Affichage du tempo actuel
// - Bouton play/pause métronome
// - Boutons presets: 60, 80, 100, 120 BPM
```

**Step 3: Intégrer dans la page de jeu**

Dans `src/app/play/[cheatId]/page.tsx` :
- Utiliser useMetronome avec le tempo du cheatCode
- Afficher TempoControls
- Indicateur visuel du beat actuel

**Step 4: Tester manuellement**

Activer le métronome, changer le tempo, vérifier le son et l'indicateur visuel.

**Step 5: Commit**

```bash
git add src/hooks/useMetronome.ts src/components/cheatcode/TempoControls.tsx src/app/play/[cheatId]/page.tsx
git commit -m "feat: add adjustable metronome with tempo controls"
```

---

## Task 4: Plus de Cheat Codes

Enrichir la bibliothèque avec des riffs et patterns célèbres.

**Files:**
- Modify: `src/data/cheatcodes.json`
- Modify: `src/types/music.ts` (ajouter catégorie/tags)

**Step 1: Ajouter des catégories au type CheatCode**

Dans `src/types/music.ts` :

```typescript
export type CheatCodeCategory = 'basics' | 'riffs' | 'chords' | 'scales' | 'songs';

export interface CheatCode {
  id: string;
  name: string;
  difficulty: Difficulty;
  tempo: number;
  sequence: NoteStep[];
  description?: string;
  category?: CheatCodeCategory;  // Nouveau
  tags?: string[];               // Nouveau: ex: ['rock', 'classic', 'beginner']
}
```

**Step 2: Ajouter 10+ nouveaux cheat codes**

Dans `src/data/cheatcodes.json`, ajouter :

```json
// Basics - Accords ouverts
{ "id": "chord-em", "name": "Accord Em", "category": "chords", ... }
{ "id": "chord-am", "name": "Accord Am", "category": "chords", ... }
{ "id": "chord-c", "name": "Accord C", "category": "chords", ... }
{ "id": "chord-g", "name": "Accord G", "category": "chords", ... }
{ "id": "chord-d", "name": "Accord D", "category": "chords", ... }

// Riffs célèbres
{ "id": "riff-smoke", "name": "Smoke on the Water", "category": "riffs", ... }
{ "id": "riff-seven-nation", "name": "Seven Nation Army", "category": "riffs", ... }
{ "id": "riff-sunshine", "name": "Sunshine of Your Love", "category": "riffs", ... }
{ "id": "riff-iron-man", "name": "Iron Man", "category": "riffs", ... }

// Gammes
{ "id": "scale-penta-em", "name": "Pentatonique Em", "category": "scales", ... }
```

**Step 3: Mettre à jour la page /play pour grouper par catégorie**

Dans `src/app/play/page.tsx` :
- Grouper les cheat codes par catégorie
- Afficher des sections avec titres

**Step 4: Tester**

Vérifier que les nouveaux cheat codes s'affichent et sont jouables.

**Step 5: Commit**

```bash
git add src/data/cheatcodes.json src/types/music.ts src/app/play/page.tsx
git commit -m "feat: add 10+ cheat codes with categories (chords, riffs, scales)"
```

---

## Task 5: Score et Statistiques

Ajouter un système de score avec historique de progression.

**Files:**
- Create: `src/lib/storage/stats.ts`
- Create: `src/types/stats.ts`
- Create: `src/hooks/useStats.ts`
- Create: `src/components/stats/ScoreDisplay.tsx`
- Create: `src/components/stats/SessionSummary.tsx`
- Modify: `src/app/play/[cheatId]/page.tsx`

**Step 1: Définir les types pour les stats**

Créer `src/types/stats.ts` :

```typescript
export interface PlaySession {
  cheatCodeId: string;
  timestamp: number;
  score: number;
  accuracy: number;      // % de notes justes
  completionTime: number; // ms pour finir
  notesPlayed: number;
  notesCorrect: number;
}

export interface CheatCodeStats {
  cheatCodeId: string;
  playCount: number;
  bestScore: number;
  averageAccuracy: number;
  lastPlayed: number;
}

export interface UserStats {
  totalPlayTime: number;
  totalSessions: number;
  totalNotesPlayed: number;
  favoriteCheatCodes: string[];
  sessions: PlaySession[];
  cheatCodeStats: Record<string, CheatCodeStats>;
}
```

**Step 2: Créer le module de stockage**

Créer `src/lib/storage/stats.ts` :

```typescript
const STATS_KEY = 'wakagratte_stats';

export function getStats(): UserStats { ... }
export function saveSession(session: PlaySession): void { ... }
export function getCheatCodeStats(id: string): CheatCodeStats | null { ... }
export function clearStats(): void { ... }
```

**Step 3: Créer le hook useStats**

Créer `src/hooks/useStats.ts` :

```typescript
export function useStats() {
  // Charger les stats au mount
  // Fournir saveSession, getStats, etc.
  // Mettre à jour en temps réel
}
```

**Step 4: Créer ScoreDisplay**

Créer `src/components/stats/ScoreDisplay.tsx` :

```typescript
// Affichage en temps réel pendant le jeu:
// - Score actuel
// - Streak
// - Accuracy %
```

**Step 5: Créer SessionSummary**

Créer `src/components/stats/SessionSummary.tsx` :

```typescript
// Affiché à la fin d'une séquence:
// - Score final
// - Accuracy
// - Temps
// - Comparaison avec record personnel
// - Boutons: Rejouer, Suivant, Voir stats
```

**Step 6: Intégrer dans la page de jeu**

Dans `src/app/play/[cheatId]/page.tsx` :
- Utiliser useStats
- Afficher ScoreDisplay pendant le jeu
- Afficher SessionSummary à la fin
- Sauvegarder la session

**Step 7: Tester**

Jouer une séquence, vérifier le score, rejouer, vérifier que le best score est sauvegardé.

**Step 8: Commit**

```bash
git add src/types/stats.ts src/lib/storage/stats.ts src/hooks/useStats.ts src/components/stats/
git commit -m "feat: add score tracking and session statistics"
```

---

## Résumé des fichiers à créer/modifier

### Nouveaux fichiers (7)
- `src/hooks/useMetronome.ts`
- `src/components/cheatcode/LoopControls.tsx`
- `src/components/cheatcode/TempoControls.tsx`
- `src/types/stats.ts`
- `src/lib/storage/stats.ts`
- `src/hooks/useStats.ts`
- `src/components/stats/ScoreDisplay.tsx`
- `src/components/stats/SessionSummary.tsx`

### Fichiers modifiés (4)
- `src/hooks/useCheatCodeValidation.ts`
- `src/app/play/[cheatId]/page.tsx`
- `src/data/cheatcodes.json`
- `src/types/music.ts`
- `src/app/play/page.tsx`

---

## Ordre d'exécution recommandé

1. **Task 1** (Wait Mode) - Fondation simple
2. **Task 5** (Stats) - Le score est déjà dans le hook, juste besoin de persister
3. **Task 3** (Tempo) - Indépendant
4. **Task 2** (Loop) - Utilise le système de validation modifié
5. **Task 4** (Cheat codes) - Contenu, peut être fait en parallèle
