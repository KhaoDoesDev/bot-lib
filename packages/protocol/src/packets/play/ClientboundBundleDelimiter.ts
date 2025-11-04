import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundBundleDelimiter extends Packet {
  static override id = 0x00;
  static override state = States.PLAY;

  constructor(
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.alloc(0);
  }

  static override deserialize(buf: Buffer): ClientboundBundleDelimiter {
    return new ClientboundBundleDelimiter();
  }
}
