import type { WeatherPreset } from "./types";

export interface AudioLayerConfig {
  id: string;
  src: string;
  volume: number;
  fadeInMs?: number;
  fadeOutMs?: number;
  playbackRateMin?: number;
  playbackRateMax?: number;
  offsetMs?: number;
}

type WeatherSceneMap = Record<WeatherPreset, AudioLayerConfig[]>;

const jitter = (min?: number, max?: number) => {
  if (typeof min === "number" && typeof max === "number" && max > min) {
    return min + Math.random() * (max - min);
  }
  return undefined;
};

export const WEATHER_AUDIO_SCENES: WeatherSceneMap = {
  dawn: [
    {
      id: "dawn-bed",
      src: "/audio/dawn-bed.mp3",
      volume: 0.3,
      fadeInMs: 4000,
      fadeOutMs: 3000,
    },
    {
      id: "dawn-birds",
      src: "/audio/dawn-birds.mp3",
      volume: 0.2,
      fadeInMs: 4500,
      playbackRateMin: 0.95,
      playbackRateMax: 1.05,
    },
  ],
  sunset: [
    {
      id: "sunset-wind",
      src: "/audio/sunset-wind.mp3",
      volume: 0.28,
      fadeInMs: 3500,
      fadeOutMs: 2800,
    },
    {
      id: "sunset-insects",
      src: "/audio/sunset-insects.mp3",
      volume: 0.18,
      playbackRateMin: 0.9,
      playbackRateMax: 1,
    },
  ],
  storm: [
    {
      id: "storm-rain",
      src: "/audio/storm-rain.mp3",
      volume: 0.35,
      fadeInMs: 2500,
    },
    {
      id: "storm-thunder",
      src: "/audio/storm-thunder.mp3",
      volume: 0.22,
      fadeInMs: 5000,
      playbackRateMin: 0.95,
      playbackRateMax: 1.05,
    },
  ],
  night: [
    {
      id: "night-crickets",
      src: "/audio/night-crickets.mp3",
      volume: 0.25,
      fadeInMs: 3000,
    },
    {
      id: "night-wind",
      src: "/audio/night-wind.mp3",
      volume: 0.15,
    },
  ],
  aurora: [
    {
      id: "aurora-breeze",
      src: "/audio/aurora-breeze.mp3",
      volume: 0.24,
      fadeInMs: 3200,
    },
    {
      id: "aurora-chimes",
      src: "/audio/aurora-chimes.mp3",
      volume: 0.18,
      playbackRateMin: 0.95,
      playbackRateMax: 1.1,
      offsetMs: 1500,
    },
  ],
  ember: [
    {
      id: "ember-fire",
      src: "/audio/ember-fire.mp3",
      volume: 0.32,
      fadeInMs: 2800,
    },
    {
      id: "ember-sparks",
      src: "/audio/ember-sparks.mp3",
      volume: 0.14,
      playbackRateMin: 0.9,
      playbackRateMax: 1.2,
    },
  ],
};

export const getAudioLayersForWeather = (weather: WeatherPreset): AudioLayerConfig[] => {
  return WEATHER_AUDIO_SCENES[weather] ?? [];
};

export const applyPlaybackJitter = (audio: HTMLAudioElement, config: AudioLayerConfig) => {
  const rate = jitter(config.playbackRateMin, config.playbackRateMax);
  if (rate) {
    audio.playbackRate = rate;
  }
};
