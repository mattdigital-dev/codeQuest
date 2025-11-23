"use client";

import { useEffect, useRef } from "react";
import type { WorkspaceSvg } from "blockly";
import { useBlockly } from "./BlocklyProvider";
import type { ChallengeDefinition } from "@/core/types";

interface BlocklyEditorProps {
  challenge: ChallengeDefinition;
  onCodeChange?: (code: string) => void;
}

export function BlocklyEditor({ challenge, onCodeChange }: BlocklyEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);
  const { blockly } = useBlockly();

  useEffect(() => {
    if (!containerRef.current) return;

    const workspace = blockly.inject(containerRef.current, {
      toolbox: challenge.toolboxXml,
      renderer: "thrasos",
      grid: {
        spacing: 24,
        snap: true,
      },
      trashcan: true,
    });

    workspaceRef.current = workspace;

    if (challenge.starterXml) {
      const xml = blockly.Xml.textToDom(challenge.starterXml);
      blockly.Xml.domToWorkspace(xml, workspace);
    }

    const listener = () => {
      const code = blockly.JavaScript.workspaceToCode(workspace);
      onCodeChange?.(code);
    };

    workspace.addChangeListener(listener);
    return () => {
      workspace.removeChangeListener(listener);
      workspace.dispose();
    };
  }, [blockly, challenge, onCodeChange]);

  return <div className="h-full w-full rounded-2xl bg-white shadow-glow" ref={containerRef} />;
}
