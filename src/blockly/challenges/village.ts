import type { ChallengeDefinition } from "@/core/types";

export const villageChallenge: ChallengeDefinition = {
  id: "village",
  zoneName: "Village de la Logique",
  title: "Réveiller le cristal",
  description:
    "Active le cristal central en allumant la lumière adéquate. Utilise un bloc d'action simple pour envoyer un signal.",
  objectives: [
    {
      id: "activate-crystal",
      label: "Allumer le cristal central",
      description: "Déclenche la lumière `crystal` afin de réveiller l'île.",
    },
    {
      id: "share-signal",
      label: "Partager un salut lumineux",
      description: "Optionnel : envoie un message via `text_print` pour saluer les habitants.",
      optional: true,
    },
  ],
  narrative: {
    mentor: {
      name: "Aïko",
      title: "Veilleuse du Village",
    },
    intro: "Approche, apprenti·e : le cristal sommeille. Une simple impulsion bien orientée suffit.",
    success: "La cloche solaire résonne — ton signal est net, le pont suivant s'éveille.",
    failure: "Le cristal reste muet. Observe le bloc ciblé et l'état envoyé avant de réessayer.",
  },
  toolboxXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Actions" colour="#f6a356">
    <block type="world_set_light"></block>
  </category>
  <category name="Logs" colour="#c38d94">
    <block type="text_print">
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">Salut CodeQuest !</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>
`,
  starterXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="world_set_light" x="24" y="24"></block>
</xml>
`,
  allowedBlocks: ["world_set_light", "text_print"],
  hint: "Sélectionne la lumière `crystal` et règle son état sur TRUE avant d'exécuter.",
  rewards: {
    xp: 50,
  },
  validate: (result) => {
    const lights = (result.state.lights as Record<string, boolean>) ?? {};
    if (lights.crystal) {
      return {
        success: true,
        message: "Parfait ! Le cristal s'illumine et ouvre le pont suivant.",
      };
    }
    return {
      success: false,
      message: "Le cristal n'a pas reçu assez de lumière. Essaie d'activer la bonne source.",
    };
  },
};
