import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundFinishConfiguration extends Packet {
  static override id = 0x03;
  static override state = States.CONFIG;

  constructor() {
    super();
  }

  serialize(): Buffer {
    return Buffer.alloc(0);
  }

  static override deserialize(buf: Buffer): ClientboundFinishConfiguration {
    return new ClientboundFinishConfiguration();
  }
}
