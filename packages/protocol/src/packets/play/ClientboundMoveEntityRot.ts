import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readBoolean,
  readByte,
  readVarInt,
  writeBoolean,
  writeByte,
  writeVarInt,
} from "../../datatypes";

export class ClientboundMoveEntityRot extends Packet {
  static override id = 0x31;
  static override state = States.PLAY;

  constructor(
    public entityId: number,
    public pitch: number,
    public yaw: number,
    public onGround: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.entityId),
      writeByte(this.pitch),
      writeByte(this.yaw),
      writeBoolean(this.onGround),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundMoveEntityRot {
    let offset = 0;

    let { value: entityId, size: entityIdBufSize } = readVarInt(buf, offset);
    offset += entityIdBufSize;
    let pitch = readByte(buf, offset);
    offset += 1;
    let yaw = readByte(buf, offset);
    offset += 1;
    let onGround = readBoolean(buf, offset);
    offset += 1;

    return new ClientboundMoveEntityRot(
      entityId,
      pitch,
      yaw,
      onGround
    );
  }
}
