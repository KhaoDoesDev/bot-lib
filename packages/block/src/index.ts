import type { Block as BlockType } from "minecraft-data";
import registry from "registry";

export default function createBlock(version: string) {
  const mcData = registry(version);

  return class Block implements BlockType {
    id: number;
    displayName: string;
    name: string;
    hardness: number | null;
    stackSize: number;
    diggable: boolean;
    boundingBox: "block" | "empty";
    material?: string;
    harvestTools?: { [k: string]: boolean; };
    variations?: { metadata: number; displayName: string; description?: string; }[];
    states?: { name: string; type: "enum" | "bool" | "int" | "direction"; values?: unknown[]; num_values: number; }[];
    drops: (number | { minCount?: number; maxCount?: number; drop: number | { id: number; metadata: number; }; })[];
    transparent: boolean;
    emitLight: number;
    filterLight: number;
    minStateId: number;
    maxStateId: number;
    defaultState: number;
    resistance?: number | null;

    constructor(id: number) {
      const blockDef = mcData.blocks[id];
      if (!blockDef) throw new Error(`Block with ID ${id} not found`);
      this.id = blockDef.id;
      this.displayName = blockDef.displayName;
      this.name = blockDef.name;
      this.hardness = blockDef.hardness;
      this.stackSize = blockDef.stackSize;
      this.diggable = blockDef.diggable;
      this.boundingBox = blockDef.boundingBox;
      this.material = blockDef.material;
      this.harvestTools = blockDef.harvestTools;
      this.variations = blockDef.variations;
      this.states = blockDef.states;
      this.drops = blockDef.drops;
      this.transparent = blockDef.transparent;
      this.emitLight = blockDef.emitLight;
      this.filterLight = blockDef.filterLight;
      this.minStateId = blockDef.minStateId;
      this.maxStateId = blockDef.maxStateId;
      this.defaultState = blockDef.defaultState;
      this.resistance = blockDef.resistance;
    }
  };
}
