import type { Biome as BiomeType } from "minecraft-data";
import registry from "registry";

export default function createBiome(version: string) {
  const mcData = registry(version);

  return class Biome implements BiomeType {
    id: number;
    name: string;
    category: string;
    temperature: number;
    precipitation?: "none" | "rain" | "snow";
    has_precipitation?: boolean;
    dimension: string;
    displayName: string;
    color: number;
    rainfall?: number;
    depth?: number;
    climates?: [
      {
        temperature: number;
        humidity: number;
        altitude: number;
        weirdness: number;
        offset: number;
      },
      ...{
        temperature: number;
        humidity: number;
        altitude: number;
        weirdness: number;
        offset: number;
      }[]
    ];
    name_legacy?: string;
    parent?: string;
    child?: number;

    constructor(id: number) {
      const biomeDef = mcData.biomes[id];
      if (!biomeDef) throw new Error(`Biome with ID ${id} not found`);

      this.id = biomeDef.id;
      this.name = biomeDef.name;
      this.category = biomeDef.category;
      this.temperature = biomeDef.temperature;
      this.precipitation = biomeDef.precipitation;
      this.has_precipitation = biomeDef.has_precipitation;
      this.dimension = biomeDef.dimension;
      this.displayName = biomeDef.displayName;
      this.color = biomeDef.color;
      this.rainfall = biomeDef.rainfall;
      this.depth = biomeDef.depth;
      this.climates = biomeDef.climates;
      this.name_legacy = biomeDef.name_legacy;
      this.parent = biomeDef.parent;
      this.child = biomeDef.child;
    }
  };
}
