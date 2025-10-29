import {
  readDouble,
  readVarInt,
  readVarLong,
  writeDouble,
  writeVarInt,
  writeVarLong,
} from "../../datatypes";
import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundInitializeBorder extends Packet {
  static override id = 0x25;
  static override state = States.PLAY;

  constructor(
    public x: number,
    public z: number,
    public oldDiameter: number,
    public newDiameter: number,
    public speed: bigint,
    public portalTeleportBoundary: number,
    public warningBlocks: number,
    public warningTime: number,
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeDouble(this.x),
      writeDouble(this.z),
      writeVarInt(this.oldDiameter),
      writeVarInt(this.newDiameter),
      writeVarLong(this.speed), 
      writeVarInt(this.portalTeleportBoundary),
      writeVarInt(this.warningBlocks),
      writeVarInt(this.warningTime),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundInitializeBorder {
    let offset = 0;

    const x = readDouble(buf, offset);
    offset += 8;
    const z = readDouble(buf, offset);
    offset += 8;
    const { value: oldDiameter, size: oldDiameterBufSize } = readVarInt(buf, offset);
    offset += oldDiameterBufSize;
    const { value: newDiameter, size: newDiameterBufSize } = readVarInt(buf, offset);
    offset += newDiameterBufSize;
    const { value: speed, size: speedBufSize } = readVarLong(buf, offset);
    offset += speedBufSize;
    const { value: portalTeleportBoundary, size: portalTeleportBoundaryBufSize } = readVarInt(buf, offset);
    offset += portalTeleportBoundaryBufSize;
    const { value: warningBlocks, size: warningBlocksBufSize } = readVarInt(buf, offset);
    offset += warningBlocksBufSize;
    const { value: warningTime, size: warningTimeBufSize } = readVarInt(buf, offset);
    offset += warningTimeBufSize;

    return new ClientboundInitializeBorder(
      x,
      z,
      oldDiameter,
      newDiameter,
      speed,
      portalTeleportBoundary,
      warningBlocks,
      warningTime
    );
  }
}
