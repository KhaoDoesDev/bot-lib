import { States } from "../../types";
import { Packet } from "../Packet";

export class ServerboundLoginAcknowledged extends Packet {
  static override id = 0x03;
  static override state = States.LOGIN;

  constructor() {
    super();
  }

  serialize(): Buffer {
    return Buffer.alloc(0);
  }

  static override deserialize(buf: Buffer): ServerboundLoginAcknowledged {
    return new ServerboundLoginAcknowledged();
  }
}
