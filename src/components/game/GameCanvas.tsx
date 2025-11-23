"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ComponentProps } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles, Stars } from "@react-three/drei";
import type { Group } from "three";
import { World } from "@/game/World";
import { CameraRig } from "@/game/CameraRig";
import { trpc } from "@/utils/trpc";
import type { DailyAtmosphere, WeatherPreset } from "@/core/types";

const DEFAULT_ATMOSPHERE: Required<
  Pick<
    DailyAtmosphere,
    | "skyColor"
    | "fogColor"
    | "ambientIntensity"
    | "directionalColor"
    | "directionalIntensity"
    | "starsVisible"
    | "weather"
  >
> & { fogRange: [number, number]; particleColor?: string } = {
  weather: "sunset",
  skyColor: "#f6f0ff",
  fogColor: "#f6f0ff",
  fogRange: [40, 150],
  ambientIntensity: 0.7,
  directionalColor: "#ffd6a5",
  directionalIntensity: 1.1,
  starsVisible: true,
  particleColor: "#ffffff",
};

const ENV_PRESET: Record<WeatherPreset, ComponentProps<typeof Environment>["preset"]> = {
  dawn: "dawn",
  sunset: "sunset",
  storm: "city",
  night: "night",
  aurora: "forest",
  ember: "studio",
};

const AUDIO_TONES: Record<NonNullable<DailyAtmosphere["audioCue"]>, number> = {
  chimes: 480,
  pulse: 320,
  storm: 140,
  lullaby: 260,
  embers: 180,
};

const AUDIO_TYPES: Record<NonNullable<DailyAtmosphere["audioCue"]>, OscillatorType> = {
  chimes: "sine",
  pulse: "triangle",
  storm: "sawtooth",
  lullaby: "square",
  embers: "triangle",
};

const useDailyAudioCue = (cue?: DailyAtmosphere["audioCue"]) => {
  useEffect(() => {
    if (!cue || typeof window === "undefined") return;

    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let mounted = true;

    const enable = () => {
      if (!mounted || audioCtx) {
        return;
      }
      audioCtx = new window.AudioContext();
      gain = audioCtx.createGain();
      gain.gain.value = 0.0005;
      oscillator = audioCtx.createOscillator();
      oscillator.type = AUDIO_TYPES[cue] ?? "sine";
      oscillator.frequency.value = AUDIO_TONES[cue] ?? 320;
      oscillator.connect(gain).connect(audioCtx.destination);
      oscillator.start();
    };

    const unlock = () => {
      if (
        audioCtx &&
        audioCtx.state === "suspended" &&
        typeof audioCtx.resume === "function"
      ) {
        audioCtx
          .resume()
          .catch(() => {
            /* noop */
          });
      } else if (!audioCtx) {
        enable();
      }
    };

    window.addEventListener("pointerdown", unlock, { once: true });

    return () => {
      mounted = false;
      window.removeEventListener("pointerdown", unlock);
      oscillator?.stop();
      oscillator?.disconnect();
      gain?.disconnect();
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {
          /* noop */
        });
      }
    };
  }, [cue]);
};

const WeatherParticles = ({
  weather,
  color,
}: {
  weather: WeatherPreset;
  color?: string;
}) => {
  if (weather === "storm") {
    return <Sparkles color={color ?? "#a5b4fc"} count={180} size={8} speed={0.2} noise={2} />;
  }
  if (weather === "aurora") {
    return <Sparkles color={color ?? "#9be7ff"} count={220} size={4} speed={0.05} noise={1} />;
  }
  if (weather === "ember") {
    return <Sparkles color={color ?? "#ff9248"} count={90} size={6} speed={0.15} noise={1.5} />;
  }
  return null;
};

export function GameCanvas() {
  const playerRef = useRef<Group>(null);
  const dailyChallenge = trpc.daily.current.useQuery(undefined, { staleTime: 60_000 });

  const atmosphere = useMemo(() => {
    const overrides = dailyChallenge.data?.narrative.atmosphere;
    return {
      ...DEFAULT_ATMOSPHERE,
      ...overrides,
      fogRange: overrides?.fogRange ?? DEFAULT_ATMOSPHERE.fogRange,
      particleColor: overrides?.particleColor ?? DEFAULT_ATMOSPHERE.particleColor,
    };
  }, [dailyChallenge.data?.narrative.atmosphere]);

  const fogRange = atmosphere.fogRange ?? DEFAULT_ATMOSPHERE.fogRange;
  const environmentPreset = ENV_PRESET[atmosphere.weather] ?? "sunset";

  useDailyAudioCue(atmosphere.audioCue);

  return (
    <Canvas
      className="h-full w-full"
      shadows
      camera={{ position: [-12, 8, 16], fov: 45 }}
    >
      <color attach="background" args={[atmosphere.skyColor]} />
      <fog attach="fog" args={[atmosphere.fogColor, fogRange[0], fogRange[1]]} />

      <ambientLight intensity={atmosphere.ambientIntensity ?? DEFAULT_ATMOSPHERE.ambientIntensity} />
      <directionalLight
        position={[-30, 40, 20]}
        intensity={atmosphere.directionalIntensity ?? DEFAULT_ATMOSPHERE.directionalIntensity}
        castShadow
        color={atmosphere.directionalColor ?? DEFAULT_ATMOSPHERE.directionalColor}
      />

      <World playerRef={playerRef} />
      <CameraRig target={playerRef} />

      {atmosphere.starsVisible !== false ? (
        <Stars radius={200} depth={60} count={3000} factor={4} saturation={0} fade />
      ) : null}
      <WeatherParticles weather={atmosphere.weather} color={atmosphere.particleColor} />
      <Environment preset={environmentPreset} />
    </Canvas>
  );
}
