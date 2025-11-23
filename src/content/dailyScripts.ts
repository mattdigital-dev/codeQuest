import type { DailyChallengeNarrative, ZoneId } from "@/core/types";

interface DailyNarrativeScript extends DailyChallengeNarrative {
  zoneId: ZoneId;
  id: string;
}

export const DAILY_NARRATIVE_SCRIPTS: DailyNarrativeScript[] = [
  {
    id: "village-dawn-echo",
    zoneId: "village",
    intro: "Aïko veut réveiller le cristal avant l'aube : trois pulsations bien dosées guideront les voyageurs.",
    success: "La lueur tissée file sur les toits; badge Veilleur des Brumes décroché pour la nuit.",
    failure: "Le cristal grésille sans éclat. Observe la cadence de tes signaux et retente avant le lever du soleil.",
    hints: [
      "Assure-toi d'activer la source `crystal` avant toute autre lumière.",
      "Une alternance crystal → lantern évite la surcharge du pilier.",
      "Allume `crystal`, puis `lantern`, et termine en réactivant `crystal` pour ouvrir la passerelle.",
    ],
  },
  {
    id: "village-twilight-greeting",
    zoneId: "village",
    intro: "Les habitant·es attendent un salut lumineux synchronisé avec la cloche du soir.",
    success: "Le village applaudit ton signal; la bannière Éclaireur Solaire flotte au vent.",
    failure: "La cloche reste silencieuse. Ajuste l'ordre de tes blocs avant la prochaine oscillation.",
    hints: [
      "Un message `text_print` peut accompagner la lumière pour convaincre la cloche.",
      "Place ton bloc `text_print` après le réglage de la lumière pour annoncer la séquence.",
      "Active `crystal` sur TRUE puis imprime \"Pont dégagé\" pour valider ce défi.",
    ],
  },
  {
    id: "forest-firefly-maze",
    zoneId: "forest",
    intro: "Rae veut coordonner un essaim de lucioles : seules des boucles régulières calmeront la forêt.",
    success: "Les arbres s’illuminent en spirale : te voilà Gardien des Runes pour la nuit.",
    failure: "Les lucioles s'éparpillent. Revérifie ta structure de boucle avant qu'elles ne se dispersent.",
    hints: [
      "Utilise une boucle pour répéter l'appel aux lucioles plutôt que des blocs isolés.",
      "Pense à initialiser l'intensité avant de lancer la boucle.",
      "Répète l'action `world_set_light` trois fois via une boucle `controls_repeat_ext`.",
    ],
  },
  {
    id: "forest-rhythm-hunt",
    zoneId: "forest",
    intro: "Une pluie de pollen sonne faux; Rae souhaite un motif sonore pour réaccorder les troncs.",
    success: "Le battement régulier apaise la canopée; badge Navigateur Astral offert.",
    failure: "Le motif se casse avant la quatrième pulsation. Jette un œil à ta condition de sortie.",
    hints: [
      "Les événements sonores doivent alterner `drum_low` puis `drum_high`.",
      "Planifie une variable compteur pour suivre les alternances.",
      "Boucle 4 fois: set `drum_low` TRUE, puis `drum_high` FALSE avant d'inverser.",
    ],
  },
  {
    id: "temple-halo-trial",
    zoneId: "temple",
    intro: "Maëlle perçoit une arche hésitante : il faut une condition précise pour ouvrir le halo central.",
    success: "Les runes chantent ton nom; le badge Héraut des Courants rejoint ton codex.",
    failure: "Le halo reste opaque; revois la logique de ton `if/else` avant la prochaine oscillation.",
    hints: [
      "Compare deux états avant de déclencher la lumière : condition > sinon.",
      "Teste si `bridge_left` ET `bridge_right` sont actifs avant d'ouvrir `halo`.",
      "Structure un `if` qui active `halo` si les deux ponts sont TRUE, sinon active `warning`.",
    ],
  },
  {
    id: "temple-riddle-threshold",
    zoneId: "temple",
    intro: "Les arches réclament une énigme numérique : Maëlle te confie la clé.",
    success: "Les colonnes pivotent en ta faveur; badge Oracle du Zénith acquis.",
    failure: "Le verdict est négatif : la somme saisie n'atteint pas le seuil requis.",
    hints: [
      "Calcule une somme avant de prendre ta décision.",
      "Compare la variable `energy` à 42 pour savoir quel bloc activer.",
      "Si `energy >= 42`, allume `halo_prime`; sinon, imprime un message d'avertissement.",
    ],
  },
  {
    id: "forge-anvil-march",
    zoneId: "forge",
    intro: "Dorin veut chauffer l'acier via une séquence de variables manipulées au millisecondes près.",
    success: "Les enclumes résonnent, tu portes désormais le titre d'Artisan des Flux.",
    failure: "La température retombe : ta variable perd de la valeur en route.",
    hints: [
      "Initialise une variable `chaleur` puis incrémente-la régulièrement.",
      "Utilise un bloc de math pour ajouter 5 à chaque tour.",
      "Boucle 3 fois : ajoute 5 à `chaleur` puis affiche la valeur via `text_print`.",
    ],
  },
  {
    id: "forge-signal-burst",
    zoneId: "forge",
    intro: "Une corne d'alarme doit envoyer trois rafales coordonnées vers la Forge.",
    success: "Signal parfait : la garde t’offre le badge Forgeron des Sillages.",
    failure: "Une rafale manque; vérifie l’ordre des signaux et recommence.",
    hints: [
      "Prévois un tableau ou une séquence qui stocke les intensités.",
      "Envoie `flare_north`, `flare_center`, `flare_south` dans cet ordre.",
      "Définis une liste de trois directions puis parcours-la pour activer chaque `flare`.",
    ],
  },
  {
    id: "tower-signal-cascade",
    zoneId: "tower",
    intro: "Lumen attend une cascade d'événements temporels pour réveiller la tour.",
    success: "Les signaux grimpent jusqu'au ciel; badge Vigie Azurée débloqué.",
    failure: "La cascade se coupe au second palier. Vérifie tes déclencheurs successifs.",
    hints: [
      "Utilise des événements différés ou un compteur temporel.",
      "Planifie trois états : `beacon_low`, `beacon_mid`, `beacon_high`.",
      "Active successivement les trois balises dans une boucle avec condition sur l'indice.",
    ],
  },
  {
    id: "tower-stormwatch",
    zoneId: "tower",
    intro: "Une tempête approche : il faut analyser les erreurs Blockly récurrentes pour sécuriser la tour.",
    success: "Tu anticipes chaque rafale; badge Observateur des Vents gagné.",
    failure: "La tour détecte encore une erreur logique. Inspecte tes comparaisons.",
    hints: [
      "Stocke les erreurs dans une variable avant de décider de la réponse.",
      "Si `errors > 2`, affiche un avertissement supplémentaire.",
      "Crée une condition `if/else` : au-delà de 2 erreurs, active `shield`; sinon imprime \"Ciel dégagé\".",
    ],
  },
  {
    id: "sanctum-harmonic-loop",
    zoneId: "sanctum",
    intro: "Elyon exige une boucle parfaite combinant toutes tes connaissances.",
    success: "Le Sanctuaire vibre d'harmonie; badge Harmonie Primordiale étincelle encore plus.",
    failure: "La résonance se rompt avant la fin. Ajuste la combinaison boucles + conditions.",
    hints: [
      "Combine boucle + condition pour ajuster l’état final.",
      "Utilise `if` à l’intérieur d’une boucle pour alterner deux lumières.",
      "Boucle 4 fois : si l’index est pair, active `aura`; sinon active `pulse`.",
    ],
  },
  {
    id: "sanctum-bridge-convergence",
    zoneId: "sanctum",
    intro: "Les ponts finaux doivent converger au même instant; Elyon t'invite à une ultime synchronisation.",
    success: "Tous les flux convergent sous tes pas; tu emportes le titre de Synthétiseur Solaire.",
    failure: "Un pont tarde à répondre. Harmonise tes valeurs partagées avant de retenter.",
    hints: [
      "Travaille avec plusieurs variables pour suivre chaque pont.",
      "Vérifie que toutes les valeurs atteignent TRUE avant de déclencher le final.",
      "Définis trois variables booléennes, mets-les à TRUE, puis active `finale` si elles sont toutes vraies.",
    ],
  },
];
