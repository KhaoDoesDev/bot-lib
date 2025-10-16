import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readString,
  readVarInt,
  writeString,
  writeVarInt,
} from "../../datatypes";
import type { KnownPack } from "./types";

export class ServerboundSelectKnownPacks extends Packet {
  static override id = 0x07;
  static override state = States.CONFIG;

  constructor(public knownPacks: KnownPack[]) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.knownPacks.length),
      ...this.knownPacks.flatMap((pack) => [
        writeString(pack.namespace),
        writeString(pack.id),
        writeString(pack.version),
      ]),
    ]);
  }

  static override deserialize(buf: Buffer): ServerboundSelectKnownPacks {
    let offset = 0;

    const { value: length, size: lengthVarIntLength } = readVarInt(buf, offset); 
    offset += lengthVarIntLength;

    const knownPacks: KnownPack[] = [];

    for (let i = 0; i < length; i++) {
      const { value: namespaceStr, size: namespaceStrLength } = readString(buf, offset); 
      offset += namespaceStrLength;

      const { value: idStr, size: idStrLength } = readString(buf, offset);
      offset += idStrLength;

      const { value: versionStr, size: versionStrLength } = readString(buf, offset);
      offset += versionStrLength;

      knownPacks.push({
        namespace: namespaceStr,
        id: idStr,
        version: versionStr,
      });
    }

    return new ServerboundSelectKnownPacks(knownPacks);
  }
}
