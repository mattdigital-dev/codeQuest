import { Vector3 } from "three";
import { ZONES } from "@/core/types";

const horizontal = (vector: Vector3) => new Vector3(vector.x, 0, vector.z);

const islandBounds = ZONES.map((zone) => ({
  id: zone.id,
  center: new Vector3(...zone.position),
  radius: zone.radius + 0.5,
}));

export const isInsideIslands = (point: Vector3) => {
  const target = horizontal(point);
  return islandBounds.some(({ center, radius }) => {
    const distance = center.clone().sub(target).length();
    return distance <= radius;
  });
};

export const clampToWalkable = (target: Vector3, fallback: Vector3) => {
  if (isInsideIslands(target)) {
    return target;
  }
  return fallback;
};
