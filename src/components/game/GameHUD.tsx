"use client";

import { useEffect, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { useGameStore } from "@/store/gameStore";
import { useUIStore } from "@/store/uiStore";
import { ZONES, zoneById } from "@/core/types";
import { readCachedProgress } from "@/core/persistence";
import { trpc } from "@/utils/trpc";
import { challenges } from "@/blockly/challenges";

export function GameHUD() {
  const { hydrate, completedZones, activeZone, xp, badges } = useGameStore();
  const { openChallenge, openCodex, closeCodex, codex } = useUIStore();

  useEffect(() => {
    hydrate(readCachedProgress());
  }, [hydrate]);

  trpc.progress.get.useQuery(undefined, {
    staleTime: 60_000,
    onSuccess: (data) => hydrate(data),
  });

  const resetMutation = trpc.progress.reset.useMutation({
    onSuccess: (data) => hydrate(data),
  });

  const currentZone = zoneById[activeZone];
  const currentChallenge = challenges[activeZone];
  const totalZones = ZONES.length;
  const totalXpPool = ZONES.reduce(
    (sum, zone) => sum + (challenges[zone.id]?.rewards?.xp ?? 0),
    0,
  );
  const earnedXp = xp;
  const nextZoneIndex = ZONES.findIndex((zone) => zone.id === activeZone) + 1;
  const nextZone = ZONES[nextZoneIndex];
  const badgeCatalog = useMemo(() => {
    const seen = new Set<string>();
    return Object.values(challenges).reduce<string[]>((acc, challenge) => {
      const badge = challenge.rewards?.badge;
      if (!badge || seen.has(badge)) {
        return acc;
      }
      seen.add(badge);
      acc.push(badge);
      return acc;
    }, []);
  }, []);
  const dailyChallengeQuery = trpc.daily.current.useQuery(undefined, {
    staleTime: 30_000,
  });
  const leaderboardQuery = trpc.daily.leaderboard.useQuery(undefined, {
    staleTime: 60_000,
  });
  const dailyChallenge = dailyChallengeQuery.data;
  const leaderboard = leaderboardQuery.data ?? [];
  const codexZoneId = codex.zoneId ?? activeZone;
  const codexZone = zoneById[codexZoneId];
  const codexChallenge = challenges[codexZoneId];

  return (
    <>
      <section className="pointer-events-none absolute left-6 top-6 flex w-[380px] flex-col gap-4">
          <Card className="pointer-events-auto">
          <header>
            <p className="text-xs uppercase text-dusk/60">Zone actuelle</p>
            <h2 className="text-2xl font-semibold text-dusk">{currentZone.name}</h2>
            <p className="text-sm text-dusk/70">{currentZone.description}</p>
          </header>
          <section className="mt-4 space-y-2" aria-label="Progression des défis">
            <ProgressBar value={completedZones.length} total={totalZones} />
            <p className="text-xs text-dusk/60">
              {completedZones.length} / {totalZones} défis maîtrisés
            </p>
          </section>
            {badgeCatalog.length ? (
              <section className="mt-4 space-y-2" aria-label="Badges débloqués">
                <p className="text-xs text-dusk/60">
                  {badges.length} / {badgeCatalog.length} badges obtenus
                </p>
                <div className="flex flex-wrap gap-2">
                  {badgeCatalog.map((badgeName) => {
                    const unlocked = badges.includes(badgeName);
                    return (
                      <span
                        key={badgeName}
                        className={`rounded-full px-3 py-1 text-xs ${
                          unlocked ? "bg-lagoon/40 text-dusk" : "bg-dusk/10 text-dusk/50"
                        }`}
                      >
                        {badgeName}
                      </span>
                    );
                  })}
                </div>
              </section>
            ) : null}
          <section className="mt-4 space-y-2" aria-label="Expérience obtenue">
            <ProgressBar value={earnedXp} total={totalXpPool || 1} />
            <p className="text-xs text-dusk/60">
              {earnedXp} / {totalXpPool} XP débloqués
            </p>
          </section>
          {nextZone ? (
            <p className="mt-4 text-xs text-dusk/70">
              Prochain palier : <span className="font-semibold">{nextZone.name}</span> (
              {nextZone.description})
            </p>
          ) : (
            <p className="mt-4 text-xs text-dusk/70">Sanctuaire final atteint. Bravo !</p>
          )}
          <footer className="mt-4 flex flex-wrap gap-3">
            <Button className="flex-1" onClick={() => openChallenge(activeZone)}>
              Ouvrir le défi
            </Button>
            <Button className="flex-1" intent="secondary" onClick={() => resetMutation.mutate()}>
              Réinitialiser
            </Button>
            <Button className="flex-1" intent="ghost" onClick={() => openCodex(activeZone)}>
              Codex
            </Button>
          </footer>
        </Card>
          <Card className="pointer-events-auto">
          <header>
            <p className="text-xs uppercase text-dusk/60">Mentorat</p>
            <h3 className="text-xl font-semibold text-dusk">
              {currentChallenge.narrative.mentor.name}
            </h3>
            <p className="text-sm text-dusk/70">{currentChallenge.narrative.mentor.title}</p>
          </header>
          <p className="mt-3 text-sm text-dusk/80">{currentZone.lore.tagline}</p>
          <p className="text-xs text-dusk/60">{currentZone.lore.ambiance}</p>
          <ul className="mt-4 space-y-2" aria-label="Objectifs clefs">
            {currentChallenge.objectives.slice(0, 2).map((objective) => (
              <li key={objective.id} className="rounded-2xl bg-white/80 p-3 text-sm text-dusk/80">
                <p className="font-semibold text-dusk">{objective.label}</p>
                <p>{objective.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs italic text-dusk/60">{currentChallenge.narrative.intro}</p>
        </Card>
      </section>
        {dailyChallenge ? (
          <section className="pointer-events-auto absolute right-6 top-6 flex w-[360px] flex-col gap-4">
            <Card>
              <header>
                <p className="text-xs uppercase text-dusk/60">Défi quotidien</p>
                <h3 className="text-xl font-semibold text-dusk">{dailyChallenge.title}</h3>
                <p className="text-sm text-dusk/70">
                  Zone : {zoneById[dailyChallenge.zoneId].name}
                </p>
              </header>
              <dl className="mt-4 space-y-2 text-sm text-dusk/80">
                <div className="flex items-center justify-between">
                  <dt className="text-xs uppercase text-dusk/50">Bonus XP</dt>
                  <dd className="font-semibold text-dusk">{dailyChallenge.bonusXp} XP</dd>
                </div>
                {dailyChallenge.bonusBadge ? (
                  <div className="flex items-center justify-between">
                    <dt className="text-xs uppercase text-dusk/50">Récompense</dt>
                    <dd className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-dusk">
                      {dailyChallenge.bonusBadge}
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-xs text-dusk/60">
                  <span>Expire</span>
                  <time dateTime={dailyChallenge.expiresAt}>
                    {new Date(dailyChallenge.expiresAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </dl>
              <Button
                className="mt-4 w-full"
                intent={dailyChallenge.alreadyCompleted ? "ghost" : "primary"}
                disabled={dailyChallenge.alreadyCompleted}
                onClick={() => openChallenge(dailyChallenge.zoneId)}
              >
                {dailyChallenge.alreadyCompleted ? "Défi validé" : "Relever le défi"}
              </Button>
            </Card>
            {leaderboard.length ? (
              <Card>
                <header className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-dusk/60">Classement XP</p>
                    <h3 className="text-lg font-semibold text-dusk">Top explorateurs</h3>
                  </div>
                  <span className="text-xs text-dusk/50">Actualisé</span>
                </header>
                <ol className="mt-4 space-y-2 text-sm text-dusk/80">
                  {leaderboard.slice(0, 5).map((entry) => (
                    <li key={entry.userId} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2">
                      <span className="font-semibold text-dusk">
                        #{entry.rank} {entry.displayName ?? "Anonyme"}
                      </span>
                      <span className="text-xs text-dusk/60">{entry.xp} XP</span>
                    </li>
                  ))}
                </ol>
              </Card>
            ) : null}
          </section>
        ) : null}
        <Modal open={codex.isOpen} onClose={closeCodex}>
        <section className="flex h-[65vh] flex-col gap-4" aria-labelledby="codex-title">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-dusk/60">Codex</p>
              <h2 id="codex-title" className="text-2xl font-semibold text-dusk">
                {codexZone.name}
              </h2>
              <p className="text-sm text-dusk/70">{codexZone.description}</p>
            </div>
            <Button intent="secondary" onClick={closeCodex}>
              Fermer
            </Button>
          </header>
          <div className="grid flex-1 gap-4 md:grid-cols-2">
            <article className="rounded-3xl bg-white/80 p-4 shadow-inner">
              <h3 className="text-lg font-semibold text-dusk">Lore</h3>
              <dl className="mt-3 space-y-3 text-sm text-dusk/80">
                <div>
                  <dt className="text-xs uppercase text-dusk/50">Gardien</dt>
                  <dd>{codexZone.lore.guardian}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-dusk/50">Devise</dt>
                  <dd>{codexZone.lore.tagline}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-dusk/50">Ambiance</dt>
                  <dd>{codexZone.lore.ambiance}</dd>
                </div>
              </dl>
            </article>
            <article className="rounded-3xl bg-white/80 p-4 shadow-inner">
              <h3 className="text-lg font-semibold text-dusk">Objectifs</h3>
              <ul className="mt-3 space-y-2 text-sm text-dusk/80">
                {codexChallenge.objectives.map((objective) => (
                  <li key={objective.id} className="rounded-2xl bg-white/90 p-3">
                    <p className="font-semibold text-dusk">{objective.label}</p>
                    <p>{objective.description}</p>
                    {objective.optional ? (
                      <span className="text-xs uppercase text-dusk/50">Optionnel</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-3xl bg-white/80 p-4 shadow-inner md:col-span-2">
              <h3 className="text-lg font-semibold text-dusk">Mentor</h3>
              <p className="text-sm text-dusk/80">
                {codexChallenge.narrative.mentor.name} — {codexChallenge.narrative.mentor.title}
              </p>
              <p className="mt-2 text-sm text-dusk/80">{codexChallenge.narrative.intro}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-dusk/70">
                <span className="rounded-full bg-white/70 px-3 py-1">
                  {codexChallenge.rewards?.xp ?? 0} XP
                </span>
                {codexChallenge.rewards?.badge ? (
                  <span className="rounded-full bg-white/70 px-3 py-1">
                    Badge : {codexChallenge.rewards.badge}
                  </span>
                ) : null}
              </div>
            </article>
          </div>
        </section>
      </Modal>
    </>
  );
}
