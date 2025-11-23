import type Blockly from "blockly";

const LIGHT_OPTIONS = [
  ["Cristal", "crystal"],
  ["Totem", "totem"],
  ["Pont", "bridge"],
];

const MARKER_OPTIONS = [
  ["Messager", "messenger"],
  ["Balise", "beacon"],
];

export const registerCustomBlocks = (blockly: typeof Blockly) => {
  blockly.Blocks.world_set_light = {
    init() {
      this.appendDummyInput()
        .appendField("mettre la lumière")
        .appendField(new blockly.FieldDropdown(LIGHT_OPTIONS), "LIGHT")
        .appendField("sur")
        .appendField(new blockly.FieldDropdown([
          ["ON", "TRUE"],
          ["OFF", "FALSE"],
        ]), "STATE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
    },
  };

  blockly.JavaScript.world_set_light = (block: Blockly.Block) => {
    const light = block.getFieldValue("LIGHT");
    const state = block.getFieldValue("STATE") === "TRUE";
    return `world.setLightState("${light}", ${state});\n`;
  };

  blockly.Blocks.world_move_marker = {
    init() {
      this.appendDummyInput()
        .appendField("déplacer")
        .appendField(new blockly.FieldDropdown(MARKER_OPTIONS), "MARKER");
      this.appendValueInput("X").setCheck("Number").appendField("x");
      this.appendValueInput("Y").setCheck("Number").appendField("y");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(180);
    },
  };

  blockly.JavaScript.world_move_marker = (block: Blockly.Block) => {
    const marker = block.getFieldValue("MARKER");
    const x = blockly.JavaScript.valueToCode(block, "X", blockly.JavaScript.ORDER_ATOMIC) || 0;
    const y = blockly.JavaScript.valueToCode(block, "Y", blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `world.moveMarker("${marker}", ${x}, ${y});\n`;
  };

  blockly.Blocks.world_increment_counter = {
    init() {
      this.appendDummyInput()
        .appendField("incrémenter compteur")
        .appendField(new blockly.FieldTextInput("forgeron"), "NAME")
        .appendField("de");
      this.appendValueInput("DELTA").setCheck("Number");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(340);
    },
  };

  blockly.JavaScript.world_increment_counter = (block: Blockly.Block) => {
    const name = block.getFieldValue("NAME");
    const delta = blockly.JavaScript.valueToCode(block, "DELTA", blockly.JavaScript.ORDER_ATOMIC) || 1;
    return `world.incrementCounter("${name}", ${delta});\n`;
  };

  blockly.Blocks.world_push_event = {
    init() {
      this.appendDummyInput()
        .appendField("envoyer événement")
        .appendField(new blockly.FieldTextInput("signal"), "NAME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
    },
  };

  blockly.JavaScript.world_push_event = (block: Blockly.Block) => {
    const name = block.getFieldValue("NAME");
    return `world.pushEvent("${name}");\n`;
  };
};
