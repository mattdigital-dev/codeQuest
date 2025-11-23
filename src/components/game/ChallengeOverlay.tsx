"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { BlocklyProvider } from "@/blockly/BlocklyProvider";
import { BlocklyEditor } from "@/blockly/BlocklyEditor";
import { executeBlocklyCode } from "@/blockly/sandboxAPI";
import { challenges } from "@/blockly/challenges";
import { useUIStore } from "@/store/uiStore";
import { useGameStore } from "@/store/gameStore";
import { trpc } from "@/utils/trpc";
import type { ChallengeResult } from "@/core/types";

export function ChallengeOverlay() {
  const { overlay, closeChallenge } = useUIStore();
  const { completeZone, hydrate } = useGameStore();
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<ChallengeResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const challenge = overlay.zoneId ? challenges[overlay.zoneId] : null;

  const upsert = trpc.progress.upsert.useMutation({
    onSuccess: (data) => hydrate(data),
  });

  const runChallenge = async () => {
    if (!challenge || !overlay.zoneId) return;
    setIsRunning(true);
    const sandboxResult = await executeBlocklyCode({ code });
    setLogs(sandboxResult.logs);
    const validation = challenge.validate(sandboxResult);
    setFeedback(validation);
    if (validation.success) {
      const newState = completeZone(overlay.zoneId);
      upsert.mutate(newState);
    }
    setIsRunning(false);
  };

  const close = () => {
    setFeedback(null);
    setLogs([]);
    closeChallenge();
  };

  return (
    <Modal open={overlay.isOpen} onClose={close}>
      {challenge ? (
        <div className="flex h-[70vh] flex-col gap-4">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-dusk/60">{challenge.zoneName}</p>
              <h2 className="text-2xl font-semibold text-dusk">{challenge.title}</h2>
              <p className="text-sm text-dusk/70">{challenge.description}</p>
            </div>
            <Button intent="secondary" onClick={close}>
              Fermer
            </Button>
          </header>
          <div className="grid flex-1 grid-cols-2 gap-4">
            <BlocklyProvider>
              <div className="col-span-1 h-full">
                <BlocklyEditor challenge={challenge} onCodeChange={setCode} />
              </div>
            </BlocklyProvider>
            <div className="col-span-1 flex h-full flex-col rounded-3xl bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dusk">Résultat</h3>
                <Button disabled={isRunning} onClick={runChallenge}>
                  {isRunning ? "Exécution..." : "Tester"}
                </Button>
              </div>
              <div className="mt-4 flex-1 overflow-y-auto rounded-2xl bg-white/80 p-4 font-mono text-xs text-dusk/80">
                {logs.length ? (
                  <ul className="space-y-2">
                    {logs.map((log, index) => (
                      <li key={index}>• {log}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-dusk/50">Lance le code pour voir les retours de la sandbox.</p>
                )}
              </div>
              {feedback ? (
                <div
                  className={`mt-4 rounded-2xl p-4 ${
                    feedback.success ? "bg-lagoon/40 text-dusk" : "bg-coral/30 text-dusk"
                  }`}
                >
                  <p className="font-semibold">
                    {feedback.success ? "Succès" : "Encore un effort"}
                  </p>
                  <p className="text-sm">{feedback.message}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <p>Choisis un défi pour commencer.</p>
      )}
    </Modal>
  );
}
