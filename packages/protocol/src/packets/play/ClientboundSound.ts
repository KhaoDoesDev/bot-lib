import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readFloat,
  readInt,
  readLong,
  readString,
  readVarInt,
  writeFloat,
  writeInt,
  writeLong,
  writeString,
  writeVarInt,
} from "../../datatypes";

export class ClientboundSound extends Packet {
  static override id = 0x6e;
  static override state = States.PLAY;

  constructor(
    public event: string,
    public category: number,
    public x: number,
    public y: number,
    public z: number,
    public volume: number,
    public pitch: number,
    public seed: bigint
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeString(this.event),
      writeVarInt(this.category),
      writeInt(this.x),
      writeInt(this.y),
      writeInt(this.z),
      writeFloat(this.volume),
      writeFloat(this.pitch),
      writeLong(this.seed),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSound {
    let offset = 0;

    const { value: event, size: s1 } = readString(buf, offset);
    offset += s1;

    const { value: category, size: s2 } = readVarInt(buf, offset);
    offset += s2;

    const x = readInt(buf, offset);
    offset += 4;
    const y = readInt(buf, offset);
    offset += 4;
    const z = readInt(buf, offset);
    offset += 4;
    const volume = readFloat(buf, offset);
    offset += 4;
    const pitch = readFloat(buf, offset);
    offset += 4;
    const seed = readLong(buf, offset);
    offset += 8;
    return new ClientboundSound(event, category, x, y, z, volume, pitch, seed);
  }
}
