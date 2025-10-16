import {
  readVarInt,
  writeVarInt,
} from "../../datatypes";
import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundSetHeldItem extends Packet {
  static override id = 0x62;
  static override state = States.PLAY;

  constructor(public slot: number) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([writeVarInt(this.slot)]);
  }

  static override deserialize(buf: Buffer): ClientboundSetHeldItem {
    return new ClientboundSetHeldItem(readVarInt(buf, 0).value);
  }
}
