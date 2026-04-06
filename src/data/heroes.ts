import { HeroDefinition } from '@/engine/types';

export const HEROES: HeroDefinition[] = [
  {
    id: 'hero-solari-1',
    name: 'Stormkallar',
    faction: 'SOLARI',
    hp: 3000,
    skillName: 'Bénédiction Solaire',
    skillDescription: 'Restaure 100 PV à toutes les créatures alliées.',
  },
  {
    id: 'hero-solari-2',
    name: 'Aurelia',
    faction: 'SOLARI',
    hp: 2800,
    skillName: 'Bouclier Divin',
    skillDescription: 'Ajoute 50 de bouclier à toutes les créatures alliées.',
  },
  {
    id: 'hero-umbra-1',
    name: 'Mort-vivant',
    faction: 'UMBRA',
    hp: 3200,
    skillName: 'Volonté Mortis',
    skillDescription: "Augmente l'ATQ de toutes les créatures de 50 pendant 1 tour.",
  },
  {
    id: 'hero-umbra-2',
    name: 'Nécrosa',
    faction: 'UMBRA',
    hp: 2600,
    skillName: 'Drain Vital',
    skillDescription: 'Inflige 80 dégâts au héros ennemi et restaure 80 PV.',
  },
];

export function getHeroesByFaction(faction: 'SOLARI' | 'UMBRA') {
  return HEROES.filter(h => h.faction === faction);
}
