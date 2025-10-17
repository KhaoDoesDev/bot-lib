import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readBoolean,
  readDouble,
  readFloat,
  readVarInt,
  writeBoolean,
  writeDouble,
  writeFloat,
  writeVarInt,
} from "../../datatypes";

export class ClientboundEntityPositionSync extends Packet {
  static override id = 0x1f;
  static override state = States.PLAY;

  constructor(
    public entityId: number,
    public x: number,
    public y: number,
    public z: number,
    public velocityX: number,
    public velocityY: number,
    public velocityZ: number,
    public yaw: number,
    public pitch: number,
    public onGround: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.entityId),
      writeDouble(this.x),
      writeDouble(this.y),
      writeDouble(this.z),
      writeDouble(this.velocityX),
      writeDouble(this.velocityY),
      writeDouble(this.velocityZ),
      writeFloat(this.yaw),
      writeFloat(this.pitch),
      writeBoolean(this.onGround),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundEntityPositionSync {
    let offset = 0;

    let { value: entityId, size: entityIdSize } = readVarInt(buf, offset);
    offset += entityIdSize;
    let x = readDouble(buf, offset);
    offset += 8;
    let y = readDouble(buf, offset);
    offset += 8;
    let z = readDouble(buf, offset);
    offset += 8;
    let velocityX = readDouble(buf, offset);
    offset += 8;
    let velocityY = readDouble(buf, offset);
    offset += 8;
    let velocityZ = readDouble(buf, offset);
    offset += 8;
    let yaw = readFloat(buf, offset);
    offset += 4;
    let pitch = readFloat(buf, offset);
    offset += 4;
    let onGround = readBoolean(buf, offset);

    return new ClientboundEntityPositionSync(
      entityId,
      x,
      y,
      z,
      velocityX,
      velocityY,
      velocityZ,
      yaw,
      pitch,
      onGround
    );
  }
}
