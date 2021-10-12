export interface PokemonDetail {
    abilities: Ability2[];
    base_experience: number;
    forms: Ability[];
    game_indices: Gameindex[];
    height: number;
    held_items: Helditem[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: Move[];
    name: string;
    order: number;
    past_types: any[];
    species: Ability;
    sprites: Sprites;
    weight: number;
  }
  
  export interface Sprites {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
    other: Other;
  }
  
  export interface Other {
    dream_world: Dreamworld;
    'official-artwork': Officialartwork;
  }
  
  export interface Officialartwork {
    front_default: string;
  }
  
  export interface Dreamworld {
    front_default: string;
    front_female?: any;
  }
  
  export interface Move {
    move: Ability;
    version_group_details: Versiongroupdetail[];
  }
  
  export interface Versiongroupdetail {
    level_learned_at: number;
    move_learn_method: Ability;
    version_group: Ability;
  }
  
  export interface Helditem {
    item: Ability;
    version_details: Versiondetail[];
  }
  
  export interface Versiondetail {
    rarity: number;
    version: Ability;
  }
  
  export interface Gameindex {
    game_index: number;
    version: Ability;
  }
  
  export interface Ability2 {
    ability: Ability;
    is_hidden: boolean;
    slot: number;
  }
  
  export interface Ability {
    name: string;
    url: string;
  }