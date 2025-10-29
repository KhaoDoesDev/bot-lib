import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readString,
  readVarInt,
  writeString,
  writeVarInt,
} from "../../datatypes";
import type { KnownPack } from "./types";

export class ClientboundSelectKnownPacks extends Packet {
  static override id = 0x0E;
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

  static override deserialize(buf: Buffer): ClientboundSelectKnownPacks {
    let offset = 0;

    const { value: length, size: lengthBufSize } = readVarInt(buf, offset); 
    offset += lengthBufSize;

    const knownPacks: KnownPack[] = [];

    for (let i = 0; i < length; i++) {
      const { value: namespaceStr, size: namespaceStrBufSize } = readString(buf, offset); 
      offset += namespaceStrBufSize;

      const { value: idStr, size: idStrBufSize } = readString(buf, offset);
      offset += idStrBufSize;

      const { value: versionStr, size: versionStrBufSize } = readString(buf, offset);
      offset += versionStrBufSize;

      knownPacks.push({
        namespace: namespaceStr,
        id: idStr,
        version: versionStr,
      });
    }

    return new ClientboundSelectKnownPacks(knownPacks);
  }
}
