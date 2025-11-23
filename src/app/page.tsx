import Link from "next/link";
import { ZONES } from "@/core/types";

export default function Home() {
  return (
    <main className="min-h-screen bg-cloud px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <section className="glass-panel rounded-[48px] px-10 py-16 shadow-glow">
          <p className="text-sm uppercase text-dusk/60">Mini-jeu éducatif</p>
          <h1 className="mt-4 text-5xl font-semibold text-dusk">
            CodeQuest · Apprends la logique en explorant des îles Blockly en 3D
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-dusk/80">
            Traversez six îlots flottants inspirés de Monument Valley, assemblez vos blocs Blockly,
            exécutez le code dans une sandbox sécurisée et débloquez de nouveaux ponts grâce à
            une progression persistée via tRPC et PostgreSQL.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/game"
              className="inline-flex items-center rounded-full bg-sand px-6 py-3 text-base font-semibold uppercase tracking-wide text-dusk shadow-lg transition hover:bg-[#f3dca6]"
            >
              Commencer l&apos;aventure
            </Link>
            <a
              href="https://developers.google.com/blockly"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-white/70 px-6 py-3 text-base font-semibold uppercase tracking-wide text-dusk/70 transition hover:bg-white/40"
            >
              Découvrir Blockly
            </a>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {ZONES.map((zone) => (
            <div key={zone.id} className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase text-dusk/60">{zone.id}</p>
              <h3 className="mt-2 text-xl font-semibold text-dusk">{zone.name}</h3>
              <p className="text-sm text-dusk/70">{zone.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
