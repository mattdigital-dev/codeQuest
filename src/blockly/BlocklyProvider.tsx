"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import Blockly from "blockly";
import "blockly/javascript";
import { registerCustomBlocks } from "./customBlocks";

interface BlocklyContextValue {
  blockly: typeof Blockly;
}

const BlocklyContext = createContext<BlocklyContextValue>({
  blockly: Blockly,
});

export const useBlockly = () => useContext(BlocklyContext);

export function BlocklyProvider({ children }: { children: React.ReactNode }) {
  const theme = useMemo(
    () =>
      Blockly.Theme.defineTheme("codequest", {
        base: Blockly.Themes.Classic,
        blockStyles: {
          logic_blocks: {
            colourPrimary: "#f08a8d",
            colourSecondary: "#f6b1a2",
            colourTertiary: "#f9d8cf",
          },
          loop_blocks: {
            colourPrimary: "#8ed1c2",
            colourSecondary: "#b4e4d9",
            colourTertiary: "#d8f4ed",
          },
          math_blocks: {
            colourPrimary: "#c0a3e5",
            colourSecondary: "#d8c5f1",
            colourTertiary: "#ede2fb",
          },
        },
        startHats: true,
        categoryStyles: {
          logic_category: { colour: "#f0b49e" },
          loop_category: { colour: "#8ed1c2" },
          math_category: { colour: "#c0a3e5" },
        },
        componentStyles: {
          workspaceBackgroundColour: "#fbf9ff",
          toolboxBackgroundColour: "#f7f2ff",
          toolboxForegroundColour: "#4f4b57",
          flyoutBackgroundColour: "#ffffff",
          flyoutForegroundColour: "#4f4b57",
        },
      }),
    [],
  );

  useEffect(() => {
    registerCustomBlocks(Blockly);
    Blockly.setLocale(Blockly.Msg);
    Blockly.setTheme(theme);
  }, [theme]);

  return (
    <BlocklyContext.Provider value={{ blockly: Blockly }}>
      <div data-theme="codequest">{children}</div>
    </BlocklyContext.Provider>
  );
}
