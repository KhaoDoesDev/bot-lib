import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readFloat,
  readVarInt,
  writeFloat,
  writeVarInt,
} from "../../datatypes";

export class ClientboundRotateHead extends Packet {
  static override id = 0x4c;
  static override state = States.PLAY;

  constructor(public entityId: number, public headYaw: number) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.entityId),
      writeFloat(this.headYaw),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundRotateHead {
    let offset = 0;

    let { value: entityId, size: entityIdSize } = readVarInt(buf, offset);
    offset += entityIdSize;
    let headYaw = readFloat(buf, offset);
    return new ClientboundRotateHead(entityId, headYaw);
  }
}
