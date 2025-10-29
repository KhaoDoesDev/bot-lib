import { States } from "../../types";
import { Packet } from "../Packet";
import { readByte, readInt, writeByte, writeInt } from "../../datatypes";

export class ClientboundEntityEvent extends Packet {
  static override id = 0x1e;
  static override state = States.PLAY;

  constructor(public entityId: number, public status: number) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([writeInt(this.entityId), writeByte(this.status)]);
  }

  static override deserialize(buf: Buffer): ClientboundEntityEvent {
    return new ClientboundEntityEvent(readInt(buf, 0), readByte(buf, 4));
  }
}
