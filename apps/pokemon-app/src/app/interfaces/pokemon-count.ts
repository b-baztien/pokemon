import { Pokemon } from "./pokemon";

export interface PokemonCount {
    count: number;
    next: string;
    previous: string;
    results: Pokemon[];
  }