import { States } from "../../types";
import { Packet } from "../Packet";
import {
  readBoolean,
  readLong,
  readVarInt,
  writeBoolean,
  writeLong,
  writeVarInt,
} from "../../datatypes";

export class ClientboundSetTime extends Packet {
  static override id = 0x6a;
  static override state = States.PLAY;

  constructor(
    public worldAge: bigint,
    public timeOfDay: number,
    public timeOfDayIncreasing: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeLong(this.worldAge),
      writeVarInt(this.timeOfDay),
      writeBoolean(this.timeOfDayIncreasing),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundSetTime {
    let offset = 0;
    const worldAge = readLong(buf, offset);
    offset += 8;
    const { value: timeOfDay, size: timeOfDayBufSize } = readVarInt(
      buf,
      offset
    );
    offset += timeOfDayBufSize;
    const timeOfDayIncreasing = readBoolean(buf, offset);

    return new ClientboundSetTime(worldAge, timeOfDay, timeOfDayIncreasing);
  }
}
