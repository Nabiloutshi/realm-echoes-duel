import { HeroDefinition } from '@/engine/types';

export const HEROES: HeroDefinition[] = [
  // ═══ HUMAINS & NAINS ═══
  {
    id: 'hero-hn-1',
    name: 'Tharion le Juste',
    race: 'HUMAINS_NAINS',
    hp: 14000,
    skillName: 'Rempart Inébranlable',
    skillDescription: 'Ajoute 200 de bouclier à toutes les créatures alliées.',
  },
  {
    id: 'hero-hn-2',
    name: 'Brunhild Forgeflamme',
    race: 'HUMAINS_NAINS',
    hp: 15000,
    skillName: 'Marteau Ancestral',
    skillDescription: "Inflige 300 dégâts à l'ennemi le plus puissant.",
  },
  // ═══ ELFES ═══
  {
    id: 'hero-elf-1',
    name: 'Sylendris Lunargent',
    race: 'ELFES',
    hp: 12000,
    skillName: 'Chant de la Forêt',
    skillDescription: 'Restaure 250 PV à toutes les créatures alliées.',
  },
  {
    id: 'hero-elf-2',
    name: 'Morvael Ombresylve',
    race: 'ELFES',
    hp: 13000,
    skillName: 'Flèche Crépusculaire',
    skillDescription: 'Inflige 200 dégâts à 2 ennemis aléatoires.',
  },
  // ═══ ORCS & TROLLS ═══
  {
    id: 'hero-ot-1',
    name: "Grok'thar Briseciel",
    race: 'ORCS_TROLLS',
    hp: 16000,
    skillName: 'Cri de Guerre',
    skillDescription: "Augmente l'ATQ de toutes les créatures de 150 pendant 1 tour.",
  },
  {
    id: 'hero-ot-2',
    name: 'Zul\'marak le Régénéré',
    race: 'ORCS_TROLLS',
    hp: 14500,
    skillName: 'Régénération Trollesque',
    skillDescription: 'Restaure 500 PV au héros et 100 PV à chaque créature.',
  },
  // ═══ GOBELINS & GNOLLS ═══
  {
    id: 'hero-gg-1',
    name: 'Skritch Doigts-Vifs',
    race: 'GOBELINS_GNOLLS',
    hp: 11000,
    skillName: 'Piège Explosif',
    skillDescription: 'Inflige 150 dégâts à toutes les créatures ennemies.',
  },
  {
    id: 'hero-gg-2',
    name: 'Fenrak Crocs-Noirs',
    race: 'GOBELINS_GNOLLS',
    hp: 13500,
    skillName: 'Morsure Empoisonnée',
    skillDescription: 'Empoisonne toutes les créatures ennemies (2 stacks).',
  },
];

export function getHeroesByRace(race: string) {
  return HEROES.filter(h => h.race === race);
}
