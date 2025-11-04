import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readVarInt,
  writeVarInt,
} from "../../datatypes";

export class ClientboundSetChunkCacheCenter extends Packet {
  static override id = 0x57;
  static override state = States.PLAY;

  constructor(
    public chunkX: number,
    public chunkZ: number
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.chunkX),
      writeVarInt(this.chunkZ),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSetChunkCacheCenter {
    let offset = 0;

    const { value: chunkX, size: chunkXBufSize } = readVarInt(buf, offset);
    offset += chunkXBufSize;
    const { value: chunkZ, size: chunkZBufSize } = readVarInt(buf, offset);
    offset += chunkZBufSize;

    return new ClientboundSetChunkCacheCenter(chunkX, chunkZ);
  }
}
