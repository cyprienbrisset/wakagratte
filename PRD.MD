📄 PRD — Wakagratte

Apprendre la guitare par Cheat Codes

1. Vision produit

Wakagratte est une application web interactive qui permet d’apprendre la guitare en jouant des cheat codes (patterns de tablatures visuelles), à la manière d’un code secret à exécuter correctement.

L’utilisateur :

accorde sa guitare via le micro 🎸

sélectionne un cheat code (ex : Wakagratte #1)

joue le motif

l’application écoute, analyse et valide la séquence jouée

reçoit un feedback visuel et sonore en temps réel

🎯 Objectif : rendre l’apprentissage ludique, gratifiant et intuitif, même pour un débutant.

2. Public cible

🎸 Débutants guitare

🎮 Gamers / profils sensibles à la gamification

👶 Enfants / ados

🎼 Autodidactes visuels

3. Plateforme & stack
Frontend

Next.js (App Router)

React + TypeScript

Canvas / SVG / WebGL (visualisation)

Tailwind CSS

Audio

Web Audio API

getUserMedia (micro)

FFT / Pitch Detection (YIN ou autocorrélation)

Librairies possibles :

pitchy

meyda

tonejs

Backend (optionnel v1)

API routes Next.js

Stockage local (localStorage / IndexedDB)

Plus tard : Firebase / Supabase

4. Fonctionnalités principales
🎚️ 4.1 Accordeur universel
Description

L’application écoute le micro et détecte la note jouée pour accorder :

guitare classique

folk

électrique

accordages alternatifs

Fonctionnalités

Détection de la note (E, A, D, G, B, E)

Indicateur visuel :

trop bas 🔻

juste ✅

trop haut 🔺

Choix d’accordage :

Standard

Drop D

Open tuning

Custom

UI

Cadran circulaire

Couleur dynamique

Animation fluide

🧩 4.2 Cheat Codes guitare
Concept

Un cheat code = une séquence de cordes + cases à jouer.

Exemple (basé sur ton image) :

corde 6 → case 2

corde 4 → case 2

corde 3 → case 3

etc.

Structure interne (JSON)
{
  "id": "waka-001",
  "name": "Wakagratte Alpha",
  "tempo": 90,
  "sequence": [
    { "string": 6, "fret": 2 },
    { "string": 4, "fret": 2 },
    { "string": 3, "fret": 3 }
  ]
}

🎧 4.3 Reconnaissance du jeu utilisateur
Objectif

Vérifier que le joueur exécute correctement le cheat code.

Analyse

Détection de la note jouée

Mapping note → corde/frette possible

Tolérance :

timing

imprécision sonore

Validation séquentielle

États

🟡 En attente

🔵 En cours

🟢 Réussi

🔴 Erreur

🎨 4.4 Interface visuelle interactive
Éléments UI

Manche de guitare interactif

Cordes animées quand jouées

Cheat code affiché comme :

tablature stylisée

lignes horizontales + cercles (comme ton image)

Progression animée pas à pas

Feedback utilisateur

Vibration visuelle sur erreur

Glow sur bonne note

Son de validation type “cheat unlocked” 🎮

🎮 4.5 Gamification

Déblocage de cheat codes

Score de précision

Combo / streak

Succès :

“Premier code”

“Sans faute”

“Accord parfait”

5. Parcours utilisateur

Landing page → “Jouer”

Autorisation micro

Accordage rapide

Sélection d’un cheat code

Mode entraînement

Validation du cheat

Feedback + récompense

6. MVP (Version 1)
Inclus

✅ Accordeur standard
✅ 3 cheat codes
✅ Détection note simple
✅ Interface visuelle tablature
✅ Feedback réussite/échec

Exclu (v1)

❌ Comptes utilisateurs
❌ Multijoueur
❌ Sauvegarde cloud
❌ IA adaptative

7. Évolutions futures

Mode freestyle

Créateur de cheat code

Partage communautaire

Mode enfant

Analyse rythmique avancée

Support basse / ukulélé

8. KPI & succès

Temps moyen par session

Cheat codes complétés

Taux de réussite

Retour utilisateur

9. Ton & identité

Fun

Accessible

Nerd-friendly 🎮

Musique + jeu