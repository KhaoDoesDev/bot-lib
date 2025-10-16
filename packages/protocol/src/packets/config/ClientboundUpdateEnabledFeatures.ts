import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readString,
  readVarInt,
  writeString,
  writeVarInt,
} from "../../datatypes";

export class ClientboundUpdateEnabledFeatures extends Packet {
  static override id = 0x0C;
  static override state = States.CONFIG;

  constructor(public featureFlags: string[]) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.featureFlags.length),
      ...this.featureFlags.map((flag) => writeString(flag)),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundUpdateEnabledFeatures {
    let offset = 0;

    const { value: length, size: lengthVarInt } = readVarInt(buf, offset);
    offset += lengthVarInt;

    const featureFlags: string[] = [];

    for (let i = 0; i < length; i++) {
      const { value: str, size: strLength } = readString(buf, offset);
      featureFlags.push(str);
      offset += strLength;
    }

    return new ClientboundUpdateEnabledFeatures(featureFlags);
  }
}
