import { States } from "../../types";
import { Packet } from "../Packet";
import { readVarInt, writeVarInt } from "../../datatypes";

export class ClientboundSetChunkCacheRadius extends Packet {
  static override id = 0x58;
  static override state = States.PLAY;

  constructor(public viewDistance: number) {
    super();
  }

  serialize(): Buffer {
    return writeVarInt(this.viewDistance);
  }

  static override deserialize(buf: Buffer): ClientboundSetChunkCacheRadius {
    return new ClientboundSetChunkCacheRadius(readVarInt(buf, 0).value);
  }
}
