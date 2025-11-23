import type { ChallengeDefinition } from "@/core/types";

export const villageChallenge: ChallengeDefinition = {
  id: "village",
  zoneName: "Village de la Logique",
  title: "Réveiller le cristal",
  description:
    "Active le cristal central en allumant la lumière adéquate. Utilise un bloc d'action simple pour envoyer un signal.",
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
