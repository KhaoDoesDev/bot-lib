import { readBoolean, readByte, writeBoolean, writeByte } from "../../datatypes";
import { Difficulties, States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundChangeDifficulty extends Packet {
  static override id = 0x0a;
  static override state = States.PLAY;

  constructor(
    public difficulty: Difficulties,
    public locked: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeByte(this.difficulty),
      writeBoolean(this.locked),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundChangeDifficulty {
    return new ClientboundChangeDifficulty(
      readByte(buf, 0),
      readBoolean(buf, 1)
    );
  }
}
