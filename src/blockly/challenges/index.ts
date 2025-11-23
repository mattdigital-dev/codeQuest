import type { ChallengeMap } from "@/core/types";
import { villageChallenge } from "./village";
import { forestChallenge } from "./forest";
import { templeChallenge } from "./temple";
import { forgeChallenge } from "./forge";
import { towerChallenge } from "./tower";
import { sanctumChallenge } from "./sanctum";

export const challenges: ChallengeMap = {
  village: villageChallenge,
  forest: forestChallenge,
  temple: templeChallenge,
  forge: forgeChallenge,
  tower: towerChallenge,
  sanctum: sanctumChallenge,
};
