import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readByte,
  readDouble,
  readShort,
  readUUID,
  readVarInt,
  writeByte,
  writeDouble,
  writeShort,
  writeUUID,
  writeVarInt,
} from "../../datatypes";

export class ClientboundAddEntity extends Packet {
  static override id = 0x01;
  static override state = States.PLAY;

  constructor(
    public entityId: number,
    public uuid: string,
    public type: number,
    public x: number,
    public y: number,
    public z: number,
    public pitch: number,
    public yaw: number,
    public headYaw: number,
    public data: number,
    public velocityX: number,
    public velocityY: number,
    public velocityZ: number,
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.entityId),
      writeUUID(this.uuid),
      writeVarInt(this.type),
      writeDouble(this.x),
      writeDouble(this.y),
      writeDouble(this.z),
      writeByte(this.yaw),
      writeByte(this.pitch),
      writeByte(this.headYaw),
      writeVarInt(this.data),
      writeShort(this.velocityX),
      writeShort(this.velocityY),
      writeShort(this.velocityZ),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundAddEntity {
    let offset = 0;

    let { value: entityId, size: entityIdSize } = readVarInt(buf, offset);
    offset += entityIdSize;
    let { value: uuid, size: uuidSize } = readUUID(buf, offset);
    offset += uuidSize;
    let { value: type, size: typeSize } = readVarInt(buf, offset);
    offset += typeSize;
    let x = readDouble(buf, offset);
    offset += 8;
    let y = readDouble(buf, offset);
    offset += 8;
    let z = readDouble(buf, offset);
    offset += 8;
    let pitch = readByte(buf, offset);
    offset += 1;
    let yaw = readByte(buf, offset);
    offset += 1;
    let headYaw = readByte(buf, offset);
    offset += 1;
    let { value: data, size: dataSize } = readVarInt(buf, offset);
    offset += dataSize;
    let velocityX = readShort(buf, offset);
    offset += 2;
    let velocityY = readShort(buf, offset);
    offset += 2;
    let velocityZ = readShort(buf, offset);
    offset += 2;

    return new ClientboundAddEntity(
      entityId,
      uuid,
      type,
      x,
      y,
      z,
      pitch,
      yaw,
      headYaw,
      data,
      velocityX,
      velocityY,
      velocityZ
    );
  }
}
