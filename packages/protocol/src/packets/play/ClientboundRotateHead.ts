import { States } from "../../types";
import { Packet } from "../Packet";
import { readByte, readVarInt, writeByte, writeVarInt } from "../../datatypes";

export class ClientboundRotateHead extends Packet {
  static override id = 0x4c;
  static override state = States.PLAY;

  constructor(public entityId: number, public headYaw: number) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([writeVarInt(this.entityId), writeByte(this.headYaw)]);
  }

  static override deserialize(buf: Buffer): ClientboundRotateHead {
    let offset = 0;

    let { value: entityId, size: entityIdBufSize } = readVarInt(buf, offset);
    offset += entityIdBufSize;
    let headYaw = readByte(buf, offset);
    return new ClientboundRotateHead(entityId, headYaw);
  }
}
