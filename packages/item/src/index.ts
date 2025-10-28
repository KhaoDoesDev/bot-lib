import type { Item as ItemType } from "minecraft-data";
import { type TagObject } from "nbt-ts";
import registry from "registry";

export default function createItem(version: string) {
  const mcData = registry(version);
  return class Item implements ItemType {
    id: number;
    count?: number;
    nbt?: TagObject;
    stackId?: number;
    displayName: string;
    stackSize: number;
    enchantCategories?: string[];
    repairWith?: string[];
    maxDurability?: number;
    durability?: number;
    metadata?: number;
    name: string;
    blockStateId?: number;
    variations?: {
      metadata: number;
      displayName: string;
      id?: number;
      name?: string;
      stackSize?: number;
      enchantCategories?: string[];
    }[];

    constructor(id: number, count?: number, nbt?: TagObject, metadata?: number, stackId?: number) {
      const itemDef = mcData.items[id];
      if (!itemDef) throw new Error(`Item with ID ${id} not found`);

      this.id = itemDef.id;
      this.count = count;
      this.nbt = nbt;
      this.metadata = metadata;
      this.stackId = stackId;
      this.displayName = itemDef.displayName;
      this.stackSize = itemDef.stackSize;
      this.enchantCategories = itemDef.enchantCategories;
      this.repairWith = itemDef.repairWith;
      this.maxDurability = itemDef.maxDurability;
      this.durability = itemDef.durability;
      this.name = itemDef.name;
      this.blockStateId = itemDef.blockStateId;
      this.variations = itemDef.variations;
    }
  };
}
