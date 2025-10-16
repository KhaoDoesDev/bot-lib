import { States } from "../../types";
import { Packet } from "../Packet";
import { readFloat, writeFloat } from "../../datatypes";

export class ClientboundKeepAlive extends Packet {
  static override id = 0x26;
  static override state = States.PLAY;

  constructor(public id: number) {
    super();
  }

  serialize(): Buffer {
    return writeFloat(this.id);
  }

  static override deserialize(buf: Buffer): ClientboundKeepAlive {
    return new ClientboundKeepAlive(
      readFloat(buf, 0)
    );
  }
}
