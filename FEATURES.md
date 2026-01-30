# Wakagratte - Roadmap des Fonctionnalités

Ce document décrit les fonctionnalités planifiées pour Wakagratte, l'application d'apprentissage de la guitare via "cheat codes".

---

## 🎸 Fonctionnalités pédagogiques principales

### Bibliothèque de contenus
- [ ] Bibliothèque de milliers de morceaux de tous styles et niveaux (rock, blues, pop, classique, metal, etc.)
- [ ] Cheat codes thématiques : riffs iconiques, accords de base, techniques spécifiques
- [ ] Catégorisation par difficulté, style musical et technique

### Affichage interactif
- [ ] Vidéos de guitaristes synchronisées avec la tablature/partition
- [ ] Affichage simultané : manche de guitare + tablature + partition standard
- [ ] Highlight des notes/accords à jouer sur le manche virtuel

### Détection et feedback en temps réel
- [ ] Reconnaissance des notes via micro du device
- [ ] Support MIDI pour guitares électriques avec interface MIDI
- [ ] Feedback visuel immédiat (succès/erreur) avec indicateur de précision

### Modes d'apprentissage
- [ ] **Wait Mode** : l'app attend que la bonne note soit jouée avant de continuer
- [ ] **Loop function** : répétition d'une section spécifique pour la travailler en boucle
- [ ] **Slow Motion** : tempo ajustable pour ralentir les passages difficiles
- [ ] **Mode séparé** : pratique des parties basses (cordes graves) ou aigües séparément

### Cours structurés
- [ ] Cours "étape par étape" : théorie, accords ouverts, barrés, gammes, lecture de tablature
- [ ] Parcours pédagogiques adaptés au niveau de l'utilisateur
- [ ] Tutoriels techniques : bends, hammer-on, pull-off, slides, palm mute, etc.

---

## 🎼 Outils d'entraînement

### Feedback et progression
- [ ] Feedback instantané sur précision des notes et timing
- [ ] Score de performance avec historique
- [ ] Statistiques de progression (temps de pratique, notes maîtrisées, etc.)

### Gestion des difficultés
- [ ] Bibliothèque classée par niveau (débutant → intermédiaire → avancé → expert)
- [ ] Détection automatique des passages difficiles
- [ ] Suggestions d'exercices ciblés pour améliorer les points faibles
- [ ] Système de montée en compétences progressive

### Accordeur intégré
- [ ] Accordeur chromatique précis
- [ ] Support des accordages alternatifs (Drop D, Open G, Open D, DADGAD, etc.)
- [ ] Accordages personnalisés

---

## 📱 Compatibilité et confort d'usage

### Multi-plateforme
- [ ] Application web (PWA)
- [ ] Application native Android
- [ ] Application native iOS

### Support matériel
- [ ] Guitares acoustiques via micro du device
- [ ] Guitares électriques via micro (ampli) ou interface audio
- [ ] Support MIDI pour guitares avec pickup MIDI
- [ ] Compatible PC, Mac, smartphones et tablettes

### Expérience utilisateur
- [ ] Interface responsive (mobile-first)
- [ ] Mode sombre / clair
- [ ] Paramètres de sensibilité micro ajustables
- [ ] Mode hors-ligne pour les contenus téléchargés

---

## 🎵 Modèle économique (Options d'abonnement)

### Version gratuite
- [ ] Accès limité : ~10 cheat codes de base
- [ ] Accordeur complet
- [ ] Exercices fondamentaux

### Abonnement Classic
- [ ] Accès à la bibliothèque complète de cheat codes
- [ ] Cours complets débutant à intermédiaire
- [ ] Statistiques avancées

### Abonnement Premium
- [ ] Tous les avantages Classic
- [ ] Cours avancés et masterclasses
- [ ] Contenus exclusifs (artistes invités)
- [ ] Support prioritaire

### Plans familiaux
- [ ] Partage avec plusieurs profils (jusqu'à 5)
- [ ] Progression individuelle par profil

---

## 🚀 Priorités MVP (Version actuelle)

Les fonctionnalités suivantes sont prioritaires pour le MVP :

1. ✅ Visualisation interactive du manche de guitare
2. ✅ Détection de pitch en temps réel via micro
3. ✅ Affichage et validation des cheat codes (séquences de notes)
4. ✅ Feedback visuel succès/erreur
5. ⬜ Accordeur fonctionnel
6. ⬜ 10+ cheat codes jouables
7. ⬜ Wait Mode basique

---

## 📋 Notes d'implémentation

### Détection audio
- Utiliser pitchy pour la détection de pitch
- Seuil de clarté minimum pour valider une note
- Tolérance de ±50 cents pour la justesse
- Tolérance de ±100ms pour le timing

### Performance
- Web Workers pour le traitement audio lourd
- requestAnimationFrame pour les animations fluides
- Lazy loading des contenus de la bibliothèque

### Sécurité
- HTTPS requis pour getUserMedia (accès micro)
- Aucune donnée audio transmise à des serveurs externes
- Stockage local des préférences et progression
