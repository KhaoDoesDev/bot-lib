import {
  readBoolean,
  readFloat,
  writeBoolean,
  writeFloat,
} from "../../datatypes";
import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundTickingState extends Packet {
  static override id = 0x78;
  static override state = States.PLAY;

  constructor(public tickRate: number, public isFrozen: boolean) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeFloat(this.tickRate),
      writeBoolean(this.isFrozen),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundTickingState {
    let offset = 0;

    const tickRate = readFloat(buf, offset);
    offset += 4;
    const isFrozen = readBoolean(buf, offset);
    offset += 1;

    return new ClientboundTickingState(tickRate, isFrozen);
  }
}
