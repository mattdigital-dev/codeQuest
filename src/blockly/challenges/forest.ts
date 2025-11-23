import type { ChallengeDefinition } from "@/core/types";

export const forestChallenge: ChallengeDefinition = {
  id: "forest",
  zoneName: "Forêt des Boucles",
  title: "Tracer un sentier répétitif",
  description:
    "Répète l'action de pose de balise 4 fois pour baliser la forêt. Utilise un bloc de boucle pour éviter la répétition manuelle.",
  objectives: [
    {
      id: "repeat-beacon",
      label: "Planter 4 balises",
      description: "Utilise une boucle pour émettre l'événement `pas` quatre fois.",
    },
    {
      id: "mark-path",
      label: "Déplacer le marqueur",
      description: "Optionnel : fais avancer le marqueur via `world_move_marker` pour visualiser la progression.",
      optional: true,
    },
  ],
  narrative: {
    mentor: {
      name: "Rae",
      title: "Traceur de la Canopée",
    },
    intro: "Dans la forêt, rien ne se répète au hasard. Compose un rythme net et la lumière te guidera.",
    success: "Les arbres chantent ta boucle : le sentier est régulier et les spores s'alignent.",
    failure: "Ton motif manque de battements. Vérifie le nombre d'itérations et l'action exécutée.",
  },
  toolboxXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Boucles" colour="#8ed1c2">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">4</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Actions" colour="#9ccdb6">
    <block type="world_push_event">
      <field name="NAME">pas</field>
    </block>
    <block type="world_move_marker"></block>
  </category>
  <category name="Nombres" colour="#c0a3e5">
    <block type="math_number"></block>
  </category>
</xml>
`,
  starterXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_repeat_ext" x="30" y="40">
    <value name="TIMES">
      <shadow type="math_number">
        <field name="NUM">4</field>
      </shadow>
    </value>
    <statement name="DO">
      <block type="world_push_event">
        <field name="NAME">pas</field>
      </block>
    </statement>
  </block>
</xml>
`,
  allowedBlocks: ["controls_repeat_ext", "world_push_event", "world_move_marker", "math_number"],
  hint: "Appuie-toi sur `controls_repeat_ext` avec la valeur 4 en entrée pour éviter les duplications.",
  rewards: {
    xp: 80,
  },
  validate: (result) => {
    const sequence = (result.state.sequence as string[]) ?? [];
    const steps = sequence.filter((event) => event === "pas").length;
    if (steps >= 4) {
      return {
        success: true,
        message: "Excellent, la forêt est balisée de manière régulière.",
      };
    }
    return {
      success: false,
      message: "Il faut au moins quatre pas répétés pour baliser le sentier.",
    };
  },
};
