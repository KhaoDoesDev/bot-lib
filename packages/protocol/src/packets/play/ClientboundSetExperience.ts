import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readFloat,
  readVarInt,
  writeFloat,
  writeVarInt,
} from "../../datatypes";

export class ClientboundSetExperience extends Packet {
  static override id = 0x60;
  static override state = States.PLAY;

  constructor(
    public experienceBar: number,
    public level: number,
    public experience: number
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeFloat(this.experienceBar),
      writeVarInt(this.level),
      writeVarInt(this.experience),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSetExperience {
    let offset = 0;

    const experienceBar = readFloat(buf, offset);
    offset += 4;
    const { value: level, size: levelBufSize } = readVarInt(buf, offset);
    offset += levelBufSize;
    const { value: experience, size: experienceBufSize } = readVarInt(
      buf,
      offset
    );
    offset += experienceBufSize;
    return new ClientboundSetExperience(experienceBar, level, experience);
  }
}
