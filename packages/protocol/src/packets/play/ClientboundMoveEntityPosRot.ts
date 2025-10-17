import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readBoolean,
  readShort,
  readVarInt,
  writeBoolean,
  writeShort,
  writeVarInt,
} from "../../datatypes";

export class ClientboundMoveEntityPosRot extends Packet {
  static override id = 0x2f;
  static override state = States.PLAY;

  constructor(
    public entityId: number,
    public deltaX: number,
    public deltaY: number,
    public deltaZ: number,
    public onGround: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.entityId),
      writeShort(this.deltaX),
      writeShort(this.deltaY),
      writeShort(this.deltaZ),
      writeBoolean(this.onGround),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundMoveEntityPosRot {
    let offset = 0;

    let { value: entityId, size: entityIdSize } = readVarInt(buf, offset);
    offset += entityIdSize;
    let deltaX = readShort(buf, offset);
    offset += 2;
    let deltaY = readShort(buf, offset);
    offset += 2;
    let deltaZ = readShort(buf, offset);
    offset += 2;
    let onGround = readBoolean(buf, offset);

    return new ClientboundMoveEntityPosRot(
      entityId,
      deltaX,
      deltaY,
      deltaZ,
      onGround
    );
  }
}
