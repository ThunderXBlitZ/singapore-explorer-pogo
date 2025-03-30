import { LatLngExpression } from "leaflet";

export interface Creature {
  id: number;
  position: LatLngExpression;
  type: "normal" | "rare" | "epic" | "legendary";
  points: number;
  caught: boolean;
}

export interface PokeStop {
  id: number;
  position: LatLngExpression;
  activated: boolean;
}

export interface HighScore {
  score: number;
  date: string;
}
