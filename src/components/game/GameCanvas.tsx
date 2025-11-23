"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Sparkles, Stars } from "@react-three/drei";
import type { Group } from "three";
import { World } from "@/game/World";
import { CameraRig } from "@/game/CameraRig";
import { trpc } from "@/utils/trpc";
import type { DailyAtmosphere, WeatherPreset } from "@/core/types";
import { applyPlaybackJitter, getAudioLayersForWeather } from "@/core/audioScenes";

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

const fadeVolume = (
  audio: HTMLAudioElement,
  target: number,
  duration = 2500,
  onComplete?: () => void,
) => {
  const startVolume = audio.volume;
  const startTime = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const next = startVolume + (target - startVolume) * progress;
    audio.volume = Math.min(1, Math.max(0, next));
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else if (onComplete) {
      onComplete();
    }
  };
  requestAnimationFrame(tick);
};

const useAmbientAudio = (weather: WeatherPreset) => {
  const [unlocked, setUnlocked] = useState(false);
  const activeLayersRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const weatherRef = useRef<WeatherPreset | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlock = () => {
      setUnlocked(true);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);

  useEffect(() => {
    return () => {
      activeLayersRef.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      activeLayersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    if (weatherRef.current === weather) return;
    weatherRef.current = weather;

    const configs = getAudioLayersForWeather(weather);
    const newLayers = new Map<string, HTMLAudioElement>();
    const cleanup: Array<() => void> = [];

    configs.forEach((config) => {
      const audio = new Audio();
      audio.src = config.src;
      audio.loop = true;
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.volume = 0;
      applyPlaybackJitter(audio, config);

      const startPlayback = () => {
        audio
          .play()
          .then(() => {
            fadeVolume(audio, config.volume, config.fadeInMs ?? 3000);
          })
          .catch((error) => {
            console.warn("[audio] Lecture impossible", config.src, error);
          });
      };

      const handleLoaded = () => {
        audio.removeEventListener("loadeddata", handleLoaded);
        if (config.offsetMs && audio.duration > 0) {
          const offsetSeconds = (config.offsetMs % (audio.duration * 1000)) / 1000;
          audio.currentTime = offsetSeconds;
        }
        startPlayback();
      };

      audio.addEventListener("loadeddata", handleLoaded);
      const fallbackStart = window.setTimeout(startPlayback, 5000);
      const errorListener = () => {
        console.warn("[audio] Fichier introuvable:", config.src);
      };
      audio.addEventListener("error", errorListener);

      cleanup.push(() => {
        window.clearTimeout(fallbackStart);
        audio.removeEventListener("loadeddata", handleLoaded);
        audio.removeEventListener("error", errorListener);
      });

      newLayers.set(config.id, audio);
    });

    const previousLayers = activeLayersRef.current;
    previousLayers.forEach((audio) => {
      fadeVolume(audio, 0, 2000, () => {
        audio.pause();
        audio.src = "";
      });
    });

    activeLayersRef.current = newLayers;

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [unlocked, weather]);
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

  useAmbientAudio(atmosphere.weather);

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
