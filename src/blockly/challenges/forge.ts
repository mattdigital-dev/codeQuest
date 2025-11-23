import type { ChallengeDefinition } from "@/core/types";

export const forgeChallenge: ChallengeDefinition = {
  id: "forge",
  zoneName: "Forge des Variables",
  title: "Chauffer l'enclume",
  description:
    "Utilise une variable compteur pour chauffer l'enclume trois fois. Chaque coup de marteau incrémente le compteur.",
  objectives: [
    {
      id: "init-counter",
      label: "Préparer la variable",
      description: "Crée une variable `coups` initialisée à 0 avant de commencer la séquence.",
    },
    {
      id: "heat-forge",
      label: "Monter en température",
      description: "Incrémente le compteur au moins trois fois via `world_increment_counter`.",
    },
  ],
  narrative: {
    mentor: {
      name: "Dorin",
      title: "Maître Forgeron",
    },
    intro: "Chaque valeur que tu stockes est une braise. Nourris-la méthodiquement et la forge rougira.",
    success: "Le métal chante : ta variable suit le rythme et la chaleur envahit l'atelier.",
    failure: "La forge reste tiède. Vérifie l'initialisation et le nombre d'incréments.",
  },
  toolboxXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Variables" colour="#f08a8d" custom="VARIABLE"></category>
  <category name="Actions" colour="#f25b5e">
    <block type="world_increment_counter">
      <field name="NAME">forge</field>
    </block>
  </category>
  <category name="Nombres" colour="#f6c48f">
    <block type="math_number"></block>
  </category>
</xml>
`,
  starterXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="variables_set" x="30" y="40">
    <field name="VAR">coups</field>
    <value name="VALUE">
      <shadow type="math_number">
        <field name="NUM">0</field>
      </shadow>
    </value>
    <next>
      <block type="world_increment_counter">
        <field name="NAME">forge</field>
        <value name="DELTA">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
    </next>
  </block>
</xml>
`,
  allowedBlocks: [
    "variables_set",
    "variables_get",
    "world_increment_counter",
    "math_number",
  ],
  hint: "Pense à relier la variable locale utilisée dans la boucle avec le compteur `forge` pour suivre la chaleur.",
  rewards: {
    xp: 160,
  },
  validate: (result) => {
    const counters = (result.state.counters as Record<string, number>) ?? {};
    if ((counters.forge ?? 0) >= 3) {
      return {
        success: true,
        message: "La forge est en fusion, l'enclume rougeoie.",
      };
    }
    return {
      success: false,
      message: "Il faut au moins trois coups mesurés pour chauffer suffisamment.",
    };
  },
};
