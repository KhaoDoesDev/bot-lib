import { States } from "../../types";
import { Packet } from "../Packet";
import { readLong, writeLong } from "../../datatypes";

export class ClientboundKeepAlive extends Packet {
  static override id = 0x26;
  static override state = States.PLAY;

  constructor(public id: bigint) {
    super();
  }

  serialize(): Buffer {
    return writeLong(this.id);
  }

  static override deserialize(buf: Buffer): ClientboundKeepAlive {
    return new ClientboundKeepAlive(
      readLong(buf, 0)
    );
  }
}
