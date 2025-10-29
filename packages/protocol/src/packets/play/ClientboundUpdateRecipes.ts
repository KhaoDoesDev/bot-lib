import { Packet } from "../Packet";
import {
  readVarInt,
  writeVarInt,
  readString,
  writeString,
} from "../../datatypes";
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
    const { value: propertySetCount, size: propertySetCountBufSize } =
      readVarInt(buf, offset);
    offset += propertySetCountBufSize;

    for (let i = 0; i < propertySetCount; i++) {
      const { value: id, size: idBufSize } = readString(buf, offset);
      offset += idBufSize;

      const { value: itemCount, size: itemCountBufSize } = readVarInt(
        buf,
        offset
      );
      offset += itemCountBufSize;

      const items: number[] = [];
      for (let j = 0; j < itemCount; j++) {
        const { value: itemId, size: itemBufSize } = readVarInt(buf, offset);
        offset += itemBufSize;
        items.push(itemId);
      }

      propertySets.push({ id, items });
    }

    const stonecutterRecipes: StonecutterRecipe[] = [];
    const { value: stonecutterCount, size: stonecutterBufSize } = readVarInt(
      buf,
      offset
    );
    offset += stonecutterBufSize;

    for (let i = 0; i < stonecutterCount; i++) {
      const { value: ingredientsCount, size: ingredientsCountBufSize } =
        readVarInt(buf, offset);
      offset += ingredientsCountBufSize;

      const ingredients: number[] = [];
      for (let j = 0; j < ingredientsCount; j++) {
        const { value: ingredientsId, size: ingredientsBufSize } = readVarInt(
          buf,
          offset
        );
        offset += ingredientsBufSize;
        ingredients.push(ingredientsId);
      }

      const { value: slotCount, size: slotCountBufSize } = readVarInt(
        buf,
        offset
      );
      offset += slotCountBufSize;

      const slotDisplay: number[] = [];
      for (let j = 0; j < slotCount; j++) {
        const { value: slotId, size: slotBufSize } = readVarInt(buf, offset);
        offset += slotBufSize;
        slotDisplay.push(slotId);
      }

      stonecutterRecipes.push({ ingredients, slotDisplay });
    }

    return new ClientboundUpdateRecipes(propertySets, stonecutterRecipes);
  }
}
