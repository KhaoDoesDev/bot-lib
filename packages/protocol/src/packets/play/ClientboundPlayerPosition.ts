import { bitfieldToTeleportFlags, States, TeleportFlags, type TeleportFlagsType } from "../../types";
import { Packet } from "../Packet";
import {
  readDouble,
  readFloat,
  readInt,
  readVarInt,
  writeDouble,
  writeFloat,
  writeInt,
  writeVarInt,
} from "../../datatypes";

export class ClientboundPlayerPosition extends Packet {
  static override id = 0x41;
  static override state = States.PLAY;

  public flags: number;

  constructor(
    public teleportId: number,
    public x: number,
    public y: number,
    public z: number,
    public velocityX: number,
    public velocityY: number,
    public velocityZ: number,
    public yaw: number,
    public pitch: number,
    flags: TeleportFlagsType
  ) {
    super();
    this.flags = 0;
    for (const key in flags) {
      if (flags[key as keyof TeleportFlagsType]) {
        this.flags |= TeleportFlags[key as keyof TeleportFlagsType];
      }
    }
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.teleportId),
      writeDouble(this.x),
      writeDouble(this.y),
      writeDouble(this.z),
      writeDouble(this.velocityX),
      writeDouble(this.velocityY),
      writeDouble(this.velocityZ),
      writeFloat(this.yaw),
      writeFloat(this.pitch),
      writeInt(this.flags),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundPlayerPosition {
    let offset = 0;

    const { value: teleportId, size: teleportIdSize } = readVarInt(buf, offset);
    offset += teleportIdSize;

    const x = readDouble(buf, offset);
    offset += 8;
    const y = readDouble(buf, offset);
    offset += 8;
    const z = readDouble(buf, offset);
    offset += 8;
    const velocityX = readDouble(buf, offset);
    offset += 8;
    const velocityY = readDouble(buf, offset);
    offset += 8;
    const velocityZ = readDouble(buf, offset);
    offset += 8;
    const yaw = readFloat(buf, offset);
    offset += 4;
    const pitch = readFloat(buf, offset);
    offset += 4;
    const flags = readInt(buf, offset);

    return new ClientboundPlayerPosition(
      teleportId,
      x,
      y,
      z,
      velocityX,
      velocityY,
      velocityZ,
      yaw,
      pitch,
      bitfieldToTeleportFlags(flags)
    );
  }
}
