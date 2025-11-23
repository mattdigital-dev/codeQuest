import type { ChallengeDefinition } from "@/core/types";

export const sanctumChallenge: ChallengeDefinition = {
  id: "sanctum",
  zoneName: "Sanctuaire Final",
  title: "Rituel d'harmonie",
  description:
    "Active simultanément les cristaux, le pont et le totem, en enregistrant trois coups de forge et un signal final.",
  objectives: [
    {
      id: "ignite-pillars",
      label: "Synchroniser les lumières",
      description: "Active crystal, bridge et totem dans la même séquence.",
    },
    {
      id: "seal-ritual",
      label: "Accomplir le rituel",
      description: "Compter trois frappes de forge puis envoyer l'événement `rituel` final.",
    },
  ],
  narrative: {
    mentor: {
      name: "Elyon",
      title: "Gardien du Sanctuaire",
    },
    intro: "Toutes tes connaissances convergent ici. Orchestre les flux avec calme et précision.",
    success: "Un halo doré t'entoure : tu as harmonisé les îles, le portail s'ouvre.",
    failure: "L'équilibre n'est pas encore parfait. Vérifie chaque pilier et le nombre exact de frappes.",
  },
  toolboxXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Actions" colour="#f6e7c1">
    <block type="world_set_light">
      <field name="LIGHT">crystal</field>
    </block>
    <block type="world_set_light">
      <field name="LIGHT">bridge</field>
    </block>
    <block type="world_set_light">
      <field name="LIGHT">totem</field>
    </block>
    <block type="world_increment_counter">
      <field name="NAME">forge</field>
    </block>
    <block type="world_push_event">
      <field name="NAME">rituel</field>
    </block>
  </category>
  <category name="Boucles" colour="#8ed1c2">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">3</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Variables" colour="#f08a8d" custom="VARIABLE"></category>
  <category name="Nombres" colour="#c0a3e5">
    <block type="math_number"></block>
  </category>
</xml>
`,
  starterXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_repeat_ext" x="30" y="30">
    <value name="TIMES">
      <shadow type="math_number">
        <field name="NUM">3</field>
      </shadow>
    </value>
    <statement name="DO">
      <block type="world_increment_counter">
        <field name="NAME">forge</field>
      </block>
    </statement>
    <next>
      <block type="world_set_light">
        <field name="LIGHT">crystal</field>
        <field name="STATE">TRUE</field>
        <next>
          <block type="world_set_light">
            <field name="LIGHT">bridge</field>
            <field name="STATE">TRUE</field>
            <next>
              <block type="world_push_event">
                <field name="NAME">rituel</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`,
  allowedBlocks: [
    "controls_repeat_ext",
    "world_increment_counter",
    "world_set_light",
    "world_push_event",
    "math_number",
  ],
  hint: "Ordonne la boucle pour la forge avant d'activer les lumières puis termine par l'événement `rituel`.",
  rewards: {
    xp: 260,
    badge: "Harmonie Primordiale",
  },
  validate: (result) => {
    const sequence = (result.state.sequence as string[]) ?? [];
    const counters = (result.state.counters as Record<string, number>) ?? {};
    const lights = (result.state.lights as Record<string, boolean>) ?? {};

    if (
      lights.crystal &&
      lights.bridge &&
      lights.totem &&
      (counters.forge ?? 0) >= 3 &&
      sequence.includes("rituel")
    ) {
      return {
        success: true,
        message: "Le rituel complet s'illumine : la passerelle vers le sanctuaire s'ouvre.",
      };
    }

    return {
      success: false,
      message: "Tous les éléments doivent être activés (3 frappes, cristaux, pont, totem, signal).",
    };
  },
};
