## Refonte Realm of Echoes → Style Deck Heroes

### Différences majeures avec l'actuel:
1. **Combat AUTO** — pas de sélection manuelle d'attaquant/cible. Les unités attaquent automatiquement l'ennemi en face ou le héros.
2. **Pas de main de cartes** — les 10 créatures sont pré-déployées (2 rangées de 5) avant le combat
3. **Pas de mana/éclats** — les cartes ont un compteur "Attente" (wait) qui diminue chaque round
4. **Héros** — grand portrait à gauche (joueur) et droite (adversaire) avec HP massifs et compétence héros
5. **UI métallique/pierre** — cadre sombre avec rivets, bordures ornées style médiéval-fantasy

### Plan d'implémentation:

**1. Nouveau Game Engine (`gameEngine.ts` + `types.ts`)**
- Nouveau GameState: héros + 2x5 slots pré-remplis
- Système de "wait" (compteur décroissant par round)
- Combat auto: chaque unité avec wait=0 attaque en face → déborde sur héros
- Compétences de héros (déclenchement auto)
- Pas de phases multiples — juste des rounds

**2. Nouveau Layout de Combat (`GamePage.tsx`)**
- Héros joueur (grand portrait) à GAUCHE
- Grille 2×5 au CENTRE (rangée du haut = ennemi, rangée du bas = joueur)
- Héros adversaire (petit portrait) en haut à DROITE
- Boutons Auto / End Round / Fast Fwd à droite
- Compteur de round

**3. Nouvelles Cartes de Combat (`GameCard.tsx`)**
- Badge LV en haut à gauche (cercle vert)
- Étoiles de rareté sous le nom
- ⚔ ATK et ❤ HP en bas
- Compteur d'attente (petit chiffre bas-droite)
- Bordure couleur selon rareté (vert/bleu/violet/or)
- Chiffres flottants géants (-264 rouge, +100 vert)

**4. Écran Deck Builder pré-combat**
- Sélection du héros
- Placement de 10 créatures dans la grille 2×5
- Stats totales en haut (ATK total, HP total)

**5. Menu principal mis à jour**
- Bouton "Combattre" lance le deck builder puis le combat

### Fichiers à réécrire:
- `src/engine/types.ts` — nouveaux types
- `src/engine/gameEngine.ts` — moteur auto-combat
- `src/hooks/useGame.ts` — hook simplifié
- `src/components/game/*` — tous les composants visuels
- `src/pages/GamePage.tsx` — nouveau layout
- `src/pages/MenuPage.tsx` — adapté
- `src/index.css` — nouvelles animations
