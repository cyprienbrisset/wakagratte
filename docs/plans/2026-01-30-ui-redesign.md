# UI Redesign - Style Flowkey/Yousician

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refondre l'interface avec une landing page style Flowkey et un layout global avec sidebar style Yousician.

**Architecture:** Layout global avec sidebar pour les pages internes, landing page isolée pour `/`.

**Tech Stack:** Next.js App Router, Tailwind CSS, composants React

---

## Task 1: Créer le layout avec sidebar

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/AppLayout.tsx`

## Task 2: Refaire la page d'accueil (landing)

**Files:**
- Modify: `src/app/page.tsx`
- Add: Image de fond guitare dans `/public`

## Task 3: Refaire la page /play (browse)

**Files:**
- Modify: `src/app/play/page.tsx`
- Create: `src/components/cheatcode/CheatCodeGrid.tsx`
- Modify: `src/components/cheatcode/CheatCodeCard.tsx`

## Task 4: Appliquer le layout aux pages internes

**Files:**
- Modify: `src/app/play/layout.tsx` (create)
- Modify: `src/app/tuner/page.tsx`
- Create: `src/app/stats/page.tsx`
- Create: `src/app/settings/page.tsx`

## Task 5: Page de jeu avec le nouveau style

**Files:**
- Modify: `src/app/play/[cheatId]/page.tsx`
