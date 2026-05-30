export type ElementCategory =
  | "nonmetal"
  | "noble-gas"
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "metalloid"
  | "halogen"
  | "post-transition-metal"
  | "transition-metal"
  | "lanthanide"
  | "actinide";

export type CosmicOrigin =
  | "big-bang"
  | "cosmic-ray-spallation"
  | "stellar-fusion-low"
  | "stellar-fusion-high"
  | "supernova"
  | "neutron-star-merger"
  | "white-dwarf-explosion"
  | "human-made";

export type BiologicalRole =
  | "essential"
  | "trace-essential"
  | "beneficial"
  | "toxic"
  | "none";

export interface AbundanceProfile {
  universe?: number | null;
  earthCrust?: number | null;
  earthAtmosphere?: number | null;
  earthOcean?: number | null;
  humanBody?: number | null;
}

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  nameEn?: string;
  category: ElementCategory;
  column: number;
  row: number;
  summary: string;
  summaryEn?: string;

  cosmicOrigin?: CosmicOrigin;
  cosmicOriginNote?: string;
  cosmicOriginNoteEn?: string;

  abundance?: AbundanceProfile;

  biologicalRole?: BiologicalRole;
  biologicalRoleNote?: string;
  biologicalRoleNoteEn?: string;

  naturalSources?: string[];
  naturalSourcesEn?: string[];

  discoveryYear?: number | "ancient";
  discoveredBy?: string;

  /** Cor de chama em teste de chama (hex CSS). Apenas para elementos com chama visível notável. */
  flameColor?: string;
  flameColorName?: string;
  flameColorNameEn?: string;

  /** Linhas espectrais de emissão mais notáveis, em nanômetros. */
  spectralLines?: number[];
}
