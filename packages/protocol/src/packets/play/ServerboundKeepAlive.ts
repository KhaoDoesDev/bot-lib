import { States } from "../../types";
import { Packet } from "../Packet";
import { readLong, writeLong } from "../../datatypes";

export class ServerboundKeepAlive extends Packet {
  static override id = 0x1b;
  static override state = States.PLAY;

  constructor(public id: bigint) {
    super();
  }

  serialize(): Buffer {
    return writeLong(this.id);
  }

  static override deserialize(buf: Buffer): ServerboundKeepAlive {
    return new ServerboundKeepAlive(readLong(buf, 0));
  }
}
