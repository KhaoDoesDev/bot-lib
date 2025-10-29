import { Packet } from "../Packet";
import { readString, writeString } from "../../datatypes";
import { States } from "../../types";

export class ClientboundLoginDisconnect extends Packet {
  static override id = 0x00;
  static override state = States.LOGIN;

  constructor(public reason: string) {
    super();
  }

  serialize(): Buffer {
    return writeString(this.reason);
  }

  static override deserialize(buf: Buffer): ClientboundLoginDisconnect {
    return new ClientboundLoginDisconnect(readString(buf, 0).value);
  }
}
