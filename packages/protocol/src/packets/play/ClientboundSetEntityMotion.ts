import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readShort,
  readVarInt,
  writeShort,
  writeVarInt,
} from "../../datatypes";

export class ClientboundSetEntityMotion extends Packet {
  static override id = 0x5e;
  static override state = States.PLAY;

  constructor(
    public entityId: number,
    public velocityX: number,
    public velocityY: number,
    public velocityZ: number
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.entityId),
      writeShort(this.velocityX),
      writeShort(this.velocityY),
      writeShort(this.velocityZ),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSetEntityMotion {
    let offset = 0;

    let { value: entityId, size: entityIdSize } = readVarInt(buf, offset);
    offset += entityIdSize;
    let velocityX = readShort(buf, offset);
    offset += 2;
    let velocityY = readShort(buf, offset);
    offset += 2;
    let velocityZ = readShort(buf, offset);
    offset += 2;

    return new ClientboundSetEntityMotion(
      entityId,
      velocityX,
      velocityY,
      velocityZ
    );
  }
}
