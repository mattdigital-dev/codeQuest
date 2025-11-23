"use client";

import { useMemo, useState } from "react";
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
  const { overlay, closeChallenge, mentorHints, increaseHintLevel, resetHintLevel } = useUIStore();
  const { completeZone, hydrate } = useGameStore();
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<ChallengeResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const challenge = overlay.zoneId ? challenges[overlay.zoneId] : null;

  const upsert = trpc.progress.upsert.useMutation({
    onSuccess: (data) => hydrate(data),
  });
  const utils = trpc.useUtils();
  const dailyChallenge = trpc.daily.current.useQuery(undefined, { staleTime: 30_000 });
  const claimDaily = trpc.daily.claim.useMutation({
    onSuccess: (data) => {
      hydrate(data.progress);
      utils.daily.current.invalidate();
      utils.daily.leaderboard.invalidate();
    },
  });
  const telemetry = trpc.telemetry.emit.useMutation();
  const emitTelemetry = (eventType: string, payload?: Record<string, unknown>) => {
    telemetry.mutate({ eventType, payload });
  };
  const activeDailyChallenge =
    overlay.zoneId && dailyChallenge.data && dailyChallenge.data.zoneId === overlay.zoneId
      ? dailyChallenge.data
      : null;

  const runChallenge = async () => {
    if (!challenge || !overlay.zoneId) return;
    setIsRunning(true);
    const startTimestamp = typeof performance !== "undefined" ? performance.now() : Date.now();
    const sandboxResult = await executeBlocklyCode({ code });
    setLogs(sandboxResult.logs);
    const validation = challenge.validate(sandboxResult);
    setFeedback(validation);
    const durationMs =
      (typeof performance !== "undefined" ? performance.now() : Date.now()) - startTimestamp;
    const zoneId = overlay.zoneId;
    const currentHintLevel = mentorHints[zoneId] ?? 0;
    emitTelemetry("challenge_attempt", {
      zoneId,
      success: validation.success,
      durationMs: Math.round(durationMs),
      hintLevel: currentHintLevel,
      logsCount: sandboxResult.logs.length,
      codeSize: code.length,
    });
      if (validation.success) {
        const newState = completeZone(zoneId);
        upsert.mutate(newState);
        resetHintLevel(zoneId);
        if (
          dailyChallenge.data &&
          dailyChallenge.data.zoneId === zoneId &&
          !dailyChallenge.data.alreadyCompleted
        ) {
          claimDaily.mutate({ zoneId });
          emitTelemetry("daily_challenge_completed", {
            zoneId,
            bonusXp: dailyChallenge.data.bonusXp,
            badge: dailyChallenge.data.bonusBadge,
          });
        }
      }
    if (!validation.success) {
      const nextLevel = increaseHintLevel(zoneId);
      emitTelemetry("mentor_hint_level_changed", {
        zoneId,
        from: currentHintLevel,
        to: nextLevel,
        lastMessage: validation.message,
      });
    }
    setIsRunning(false);
  };

  const close = () => {
    setFeedback(null);
    setLogs([]);
    closeChallenge();
  };

  const mentorLine = useMemo(() => {
    if (!challenge) {
      return "";
    }
    if (activeDailyChallenge) {
      if (!feedback) {
        return activeDailyChallenge.narrative.intro;
      }
      return feedback.success
        ? activeDailyChallenge.narrative.success
        : activeDailyChallenge.narrative.failure;
    }
    if (!feedback) {
      return challenge.narrative.intro;
    }
    return feedback.success ? challenge.narrative.success : challenge.narrative.failure;
  }, [challenge, feedback, activeDailyChallenge]);

  const hintLevel = overlay.zoneId ? mentorHints[overlay.zoneId] ?? 0 : 0;
  const adaptiveHint = useMemo(() => {
    if (!challenge || hintLevel <= 0) {
      return null;
    }
    const dailyHints = activeDailyChallenge?.narrative.hints ?? [];
    if (activeDailyChallenge && dailyHints.length) {
      const index = Math.min(dailyHints.length - 1, hintLevel - 1);
      return dailyHints[index];
    }
    if (hintLevel === 1) {
      return challenge.hint ?? challenge.adaptiveHints?.[0] ?? null;
    }
    const hints = challenge.adaptiveHints ?? [];
    if (!hints.length) {
      return challenge.hint ?? null;
    }
    const index = Math.min(hints.length - 1, hintLevel - 2);
    return hints[index];
  }, [challenge, hintLevel, activeDailyChallenge]);

  const baseHint = activeDailyChallenge?.narrative.hints[0] ?? challenge?.hint;
  const displayedHint = adaptiveHint ?? baseHint ?? null;

  return (
    <Modal open={overlay.isOpen} onClose={close}>
      {challenge ? (
        <section className="flex h-[70vh] flex-col gap-4" aria-labelledby="challenge-title">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase text-dusk/60">{challenge.zoneName}</p>
                  {activeDailyChallenge ? (
                    <span className="rounded-full bg-lagoon/30 px-3 py-1 text-[10px] font-semibold uppercase text-dusk">
                      Défi quotidien
                    </span>
                  ) : null}
                </div>
              <h2 id="challenge-title" className="text-2xl font-semibold text-dusk">
                {challenge.title}
              </h2>
              <p className="text-sm text-dusk/70">{challenge.description}</p>
            </div>
            <Button intent="secondary" onClick={close}>
              Fermer
            </Button>
          </header>
          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            <article className="h-full">
              <BlocklyProvider>
                <BlocklyEditor challenge={challenge} onCodeChange={setCode} />
              </BlocklyProvider>
            </article>
            <aside className="flex h-full flex-col gap-4 rounded-3xl bg-white/70 p-4">
              <section aria-labelledby="objectives-title">
                <header className="flex items-center justify-between">
                  <h3 id="objectives-title" className="text-lg font-semibold text-dusk">
                    Objectifs
                  </h3>
                  {challenge.rewards ? (
                    <p className="text-xs font-semibold uppercase text-dusk/60">
                      {challenge.rewards.xp} XP
                      {challenge.rewards.badge ? ` · ${challenge.rewards.badge}` : ""}
                    </p>
                  ) : null}
                </header>
                <ul className="mt-3 space-y-2">
                  {challenge.objectives.map((objective) => (
                    <li key={objective.id} className="rounded-2xl bg-white/80 p-3 shadow-inner">
                      <header className="flex items-center justify-between text-sm font-medium text-dusk">
                        <span>{objective.label}</span>
                        {objective.optional ? (
                          <span className="text-xs uppercase text-dusk/50">Optionnel</span>
                        ) : null}
                      </header>
                      <p className="mt-1 text-sm text-dusk/70">{objective.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
              <section
                aria-labelledby="mentor-title"
                className="rounded-2xl bg-white/80 p-4 shadow-inner"
              >
                <header>
                  <p className="text-xs uppercase text-dusk/60">{challenge.narrative.mentor.title}</p>
                  <p id="mentor-title" className="text-base font-semibold text-dusk">
                    {challenge.narrative.mentor.name}
                  </p>
                </header>
                <p className="mt-2 text-sm text-dusk/80">{mentorLine}</p>
                  {displayedHint ? (
                    <p className="mt-3 text-xs italic text-dusk/60">Indice : {displayedHint}</p>
                  ) : null}
              </section>
              <section
                aria-labelledby="execution-title"
                className="flex flex-1 flex-col rounded-2xl bg-white/80 p-4"
              >
                <header className="flex items-center justify-between">
                  <h3 id="execution-title" className="text-lg font-semibold text-dusk">
                    Résultat
                  </h3>
                  <Button disabled={isRunning} onClick={runChallenge}>
                    {isRunning ? "Exécution..." : "Tester"}
                  </Button>
                </header>
                <div className="mt-4 flex-1 overflow-y-auto rounded-2xl bg-white/90 p-4 font-mono text-xs text-dusk/80">
                  {logs.length ? (
                    <ul className="space-y-2">
                      {logs.map((log, index) => (
                        <li key={index}>• {log}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-dusk/50">
                      Lance le code pour voir les retours de la sandbox.
                    </p>
                  )}
                </div>
                {feedback ? (
                  <footer
                    className={`mt-4 rounded-2xl p-4 ${
                      feedback.success ? "bg-lagoon/40 text-dusk" : "bg-coral/30 text-dusk"
                    }`}
                  >
                    <p className="font-semibold">
                      {feedback.success ? "Succès" : "Encore un effort"}
                    </p>
                    <p className="text-sm">{feedback.message}</p>
                    <p className="text-xs text-dusk/80">{mentorLine}</p>
                  </footer>
                ) : null}
              </section>
            </aside>
          </div>
        </section>
      ) : (
        <p>Choisis un défi pour commencer.</p>
      )}
    </Modal>
  );
}
