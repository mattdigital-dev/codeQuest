import type { ChallengeDefinition } from "@/core/types";

export const templeChallenge: ChallengeDefinition = {
  id: "temple",
  zoneName: "Temple des Conditions",
  title: "Choisir la bonne arche",
  description:
    "Lorsque la rune est lumineuse, allume le pont pour ouvrir le temple, sinon éteins le totem pour économiser l'énergie.",
  toolboxXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Conditions" colour="#c0a3e5">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_boolean"></block>
  </category>
  <category name="Actions" colour="#f08a8d">
    <block type="world_set_light">
      <field name="LIGHT">bridge</field>
    </block>
    <block type="world_set_light">
      <field name="LIGHT">totem</field>
    </block>
  </category>
</xml>
`,
  starterXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_if" x="34" y="30">
    <mutation else="1"></mutation>
    <value name="IF0">
      <block type="logic_boolean">
        <field name="BOOL">TRUE</field>
      </block>
    </value>
    <statement name="DO0">
      <block type="world_set_light">
        <field name="LIGHT">bridge</field>
        <field name="STATE">TRUE</field>
      </block>
    </statement>
    <statement name="ELSE">
      <block type="world_set_light">
        <field name="LIGHT">totem</field>
        <field name="STATE">FALSE</field>
      </block>
    </statement>
  </block>
</xml>
`,
  allowedBlocks: ["controls_if", "logic_compare", "logic_boolean", "world_set_light"],
  validate: (result) => {
    const lights = (result.state.lights as Record<string, boolean>) ?? {};
    if (lights.bridge === true && lights.totem === false) {
      return {
        success: true,
        message: "La condition est correctement appliquée, le temple se réveille.",
      };
    }
    return {
      success: false,
      message: "Le pont doit être allumé et le totem éteint en fonction de la condition.",
    };
  },
};
