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

    const { value: length, size: lengthBufSize } = readVarInt(buf, offset);
    offset += lengthBufSize;

    const featureFlags: string[] = [];

    for (let i = 0; i < length; i++) {
      const { value: featureFlag, size: featureFlagBufSize } = readString(buf, offset);
      featureFlags.push(featureFlag);
      offset += featureFlagBufSize;
    }

    return new ClientboundUpdateEnabledFeatures(featureFlags);
  }
}
