import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readBoolean,
  readNbt,
  readString,
  readVarInt,
  writeBoolean,
  writeString,
  writeVarInt,
} from "../../datatypes";
import type { DecodeResult, Tag } from "nbt-ts";

export interface NbtData {
  name: string | null;
  value: Tag | null;
}

export interface RegistryEntry {
  id: string;
  data?: Buffer | NbtData | null;
}

export class ClientboundRegistryData extends Packet {
  static override id = 0x07;
  static override state = States.CONFIG;

  constructor(public registryId: string, public entries: RegistryEntry[] = []) {
    super();
  }

  async serialize(): Promise<Buffer> {
    const entries = await Promise.all(
      this.entries.map(async (entry) => {
        const idBuf = writeString(entry.id);
        if (entry.data instanceof Buffer) {
          return Buffer.concat([
            idBuf,
            writeBoolean(true),
            entry.data as Buffer,
          ]);
        } else {
          return Buffer.concat([idBuf, writeBoolean(false)]);
        }
      })
    );
    return Buffer.concat([
      writeString(this.registryId),
      writeVarInt(this.entries.length),
      ...entries,
    ]);
  }

  static override async deserialize(
    buf: Buffer
  ): Promise<ClientboundRegistryData> {
    let offset = 0;

    const { value: registryId, size: registryIdBufSize } = readString(
      buf,
      offset
    ); // identifier
    offset += registryIdBufSize;

    const { value: length, size: lengthBufSize } = readVarInt(buf, offset); // length of prefixed array
    offset += lengthBufSize;

    const entries: RegistryEntry[] = [];

    for (let i = 0; i < length; i++) {
      const { value: idStr, size: idStrBufSize } = readString(buf, offset); // identifier
      offset += idStrBufSize;

      const hasNbt = readBoolean(buf, offset); // boolean of prefixed optional
      offset += 1;

      let nbtData: DecodeResult | null = null;

      if (hasNbt) {
        nbtData = await readNbt(buf.subarray(offset), { unnamed: true });
        offset += nbtData?.length ?? 0;
      }

      entries.push({ id: idStr, data: nbtData });
    }

    const result = new ClientboundRegistryData(registryId, entries);
    return result;
  }
}
