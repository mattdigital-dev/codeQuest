import type { ChallengeDefinition } from "@/core/types";

export const towerChallenge: ChallengeDefinition = {
  id: "tower",
  zoneName: "Tour des Événements",
  title: "Répondre aux signaux",
  description:
    "La tour reçoit deux signaux : « gong » et « clairon ». Écoute ces événements et allume les lumières correspondantes.",
  objectives: [
    {
      id: "emit-signals",
      label: "Émettre gong et clairon",
      description: "Assure-toi que les deux événements sont envoyés dans la séquence.",
    },
    {
      id: "react-lights",
      label: "Allumer la tour",
      description: "Allume le totem lorsque les signaux requis ont été reçus.",
    },
  ],
  narrative: {
    mentor: {
      name: "Lumen",
      title: "Vigie de la Tour",
    },
    intro: "Les signaux orchestrent la lumière. Capte-les, réponds-y, et la tour dansera.",
    success: "La tour pulse au rythme des deux appels — tes réactions sont impeccables.",
    failure: "Il manque un signal ou une action. Vérifie l'ordre des événements et la lumière ciblée.",
  },
  toolboxXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Événements" colour="#7fb2ff">
    <block type="world_push_event">
      <field name="NAME">gong</field>
    </block>
    <block type="world_push_event">
      <field name="NAME">clairon</field>
    </block>
  </category>
  <category name="Conditions" colour="#a5c6ff">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_boolean"></block>
  </category>
  <category name="Actions" colour="#e8b7f6">
    <block type="world_set_light">
      <field name="LIGHT">totem</field>
    </block>
    <block type="world_set_light">
      <field name="LIGHT">bridge</field>
    </block>
  </category>
</xml>
`,
  starterXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="world_push_event" x="24" y="30">
    <field name="NAME">gong</field>
    <next>
      <block type="world_push_event">
        <field name="NAME">clairon</field>
      </block>
    </next>
  </block>
</xml>
`,
  allowedBlocks: [
    "world_push_event",
    "world_set_light",
    "controls_if",
    "logic_compare",
    "logic_boolean",
  ],
  hint: "Stocke les événements dans des variables ou vérifie la séquence avant de déclencher la lumière.",
  rewards: {
    xp: 190,
  },
  validate: (result) => {
    const sequence = (result.state.sequence as string[]) ?? [];
    const lights = (result.state.lights as Record<string, boolean>) ?? {};
    const hasGong = sequence.includes("gong");
    const hasClairon = sequence.includes("clairon");
    if (hasGong && hasClairon && lights.totem) {
      return {
        success: true,
        message: "La tour a capté les deux signaux, le totem scintille.",
      };
    }
    return {
      success: false,
      message: "Assure-toi d'émettre les deux événements et d'activer le totem.",
    };
  },
};
