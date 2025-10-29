import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readBoolean,
  readLong,
  writeBoolean,
  writeLong,
} from "../../datatypes";

export class ClientboundSetTime extends Packet {
  static override id = 0x6a;
  static override state = States.PLAY;

  constructor(
    public worldAge: bigint,
    public timeOfDay: bigint,
    public timeOfDayIncreasing: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeLong(this.worldAge),
      writeLong(this.timeOfDay),
      writeBoolean(this.timeOfDayIncreasing),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSetTime {
    let offset = 0;
    const worldAge = readLong(buf, offset);
    offset += 8;
    const timeOfDay = readLong(buf, offset);
    offset += 8;
    const timeOfDayIncreasing = readBoolean(buf, offset);

    return new ClientboundSetTime(worldAge, timeOfDay, timeOfDayIncreasing);
  }
}
