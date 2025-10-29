import {
  readFloat,
  readPosition,
  writeFloat,
  writePosition,
} from "../../datatypes";
import { States, type Position } from "../../types";
import { Packet } from "../Packet";

export class ClientboundSetDefaultSpawnPosition extends Packet {
  static override id = 0x5a;
  static override state = States.PLAY;

  constructor(public location: Position, public angle: number) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writePosition(this.location.x, this.location.y, this.location.z),
      writeFloat(this.angle),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSetDefaultSpawnPosition {
    let offset = 0;

    const location = readPosition(buf, offset);
    offset += 8;
    const angle = readFloat(buf, offset);
    offset += 4;

    return new ClientboundSetDefaultSpawnPosition(location, angle);
  }
}
