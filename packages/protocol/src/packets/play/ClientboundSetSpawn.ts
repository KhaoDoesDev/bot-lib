import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readFloat,
  readVarInt,
  writeFloat,
  writeVarInt,
} from "../../datatypes";

export class ClientboundSetSpawn extends Packet {
  static override id = 0x61;
  static override state = States.PLAY;

  constructor(
    public health: number,
    public food: number,
    public saturation: number
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeFloat(this.health),
      writeVarInt(this.food),
      writeFloat(this.saturation),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSetSpawn {
    let offset = 0;

    const health = readFloat(buf, offset);
    offset += 4;
    const { value: food, size: foodBufSize } = readVarInt(buf, offset);
    offset += foodBufSize;
    const saturation = readFloat(buf, offset);
    offset += 4;
    return new ClientboundSetSpawn(health, food, saturation);
  }
}
