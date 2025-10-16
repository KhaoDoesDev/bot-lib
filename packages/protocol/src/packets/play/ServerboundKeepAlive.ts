import { States } from "../../types";
import { Packet } from "../Packet";
import { readFloat, writeFloat } from "../../datatypes";

export class ServerboundKeepAlive extends Packet {
  static override id = 0x1B;
  static override state = States.PLAY;

  constructor(public id: number) {
    super();
  }

  serialize(): Buffer {
    return writeFloat(this.id);
  }

  static override deserialize(buf: Buffer): ServerboundKeepAlive {
    return new ServerboundKeepAlive(
      readFloat(buf, 0)
    );
  }
}
