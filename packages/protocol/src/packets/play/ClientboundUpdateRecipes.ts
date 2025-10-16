import { Packet } from "../Packet";
import { readVarInt, writeVarInt, readString, writeString } from "../../datatypes";
import { States } from "../../types";

export type PropertySet = {
  id: string;
  items: number[];
};

export type StonecutterRecipe = {
  ingredients: number[];
  slotDisplay: number[];
};

export class ClientboundUpdateRecipes extends Packet {
  static override id = 0x7e;
  static override state = States.PLAY;

  constructor(
    public propertySets: PropertySet[] = [],
    public stonecutterRecipes: StonecutterRecipe[] = []
  ) {
    super();
  }

  serialize(): Buffer {
    const buffers: Buffer[] = [];

    buffers.push(writeVarInt(this.propertySets.length));
    for (const set of this.propertySets) {
      buffers.push(writeString(set.id));
      buffers.push(writeVarInt(set.items.length));
      for (const itemId of set.items) {
        buffers.push(writeVarInt(itemId));
      }
    }

    buffers.push(writeVarInt(this.stonecutterRecipes.length));
    for (const recipe of this.stonecutterRecipes) {
      buffers.push(writeVarInt(recipe.ingredients.length));
      for (const ing of recipe.ingredients) {
        buffers.push(writeVarInt(ing));
      }

      buffers.push(writeVarInt(recipe.slotDisplay.length));
      for (const slot of recipe.slotDisplay) {
        buffers.push(writeVarInt(slot));
      }
    }

    return Buffer.concat(buffers);
  }

  static override deserialize(buf: Buffer): ClientboundUpdateRecipes {
    let offset = 0;

    const propertySets: PropertySet[] = [];
    const { value: propertySetCount, size: psSize } = readVarInt(buf, offset);
    offset += psSize;

    for (let i = 0; i < propertySetCount; i++) {
      const { value: id, size: idSize } = readString(buf, offset);
      offset += idSize;

      const { value: itemCount, size: itemCountSize } = readVarInt(buf, offset);
      offset += itemCountSize;

      const items: number[] = [];
      for (let j = 0; j < itemCount; j++) {
        const { value: itemId, size: itemSize } = readVarInt(buf, offset);
        offset += itemSize;
        items.push(itemId);
      }

      propertySets.push({ id, items });
    }

    const stonecutterRecipes: StonecutterRecipe[] = [];
    const { value: stoneCount, size: stoneSize } = readVarInt(buf, offset);
    offset += stoneSize;

    for (let i = 0; i < stoneCount; i++) {
      const { value: ingCount, size: ingCountSize } = readVarInt(buf, offset);
      offset += ingCountSize;

      const ingredients: number[] = [];
      for (let j = 0; j < ingCount; j++) {
        const { value: ingId, size: ingSize } = readVarInt(buf, offset);
        offset += ingSize;
        ingredients.push(ingId);
      }

      const { value: slotCount, size: slotCountSize } = readVarInt(buf, offset);
      offset += slotCountSize;

      const slotDisplay: number[] = [];
      for (let j = 0; j < slotCount; j++) {
        const { value: slotId, size: slotSize } = readVarInt(buf, offset);
        offset += slotSize;
        slotDisplay.push(slotId);
      }

      stonecutterRecipes.push({ ingredients, slotDisplay });
    }

    return new ClientboundUpdateRecipes(propertySets, stonecutterRecipes);
  }
}
