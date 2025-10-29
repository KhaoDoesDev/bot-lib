import { Packet } from "../Packet";
import { States } from "../../types";
import { readBoolean, readNbt, readString, readVarInt, writeBoolean, writeString, writeVarInt } from "../../datatypes";
import { type DecodeResult, type Tag } from "nbt-ts";

export interface NbtData {
  name: string | null;
  value: Tag | null;
}

export interface RegistryEntry { 
  id: string;
  data?: Buffer | NbtData | null
};

export class ClientboundRegistryData extends Packet {
  static override id = 0x07;
  static override state = States.CONFIG;

  constructor(public registryId: string, public entries: RegistryEntry[] = []) {
    super();
  }

  async serialize(): Promise<Buffer> {
    const entries = await Promise.all(this.entries.map(async entry => {
      const idBuf = writeString(entry.id);
      if (entry.data instanceof Buffer) {
        return Buffer.concat([idBuf, writeBoolean(true), entry.data as Buffer]);
      } else {
        return Buffer.concat([idBuf, writeBoolean(false)]);
      }
    }));
    return Buffer.concat([
      writeString(this.registryId),
      writeVarInt(this.entries.length),
      ...entries
    ]);
  }

  static override async deserialize(buf: Buffer): Promise<ClientboundRegistryData> {
    let offset = 0;

    const { value: registryId, size: registryIdSize } = readString(buf, offset); // identifier
    offset += registryIdSize;

    const { value: len, size: lenSize } = readVarInt(buf, offset); // length of prefixed array
    offset += lenSize;

    const entries: RegistryEntry[] = [];

    for (let i = 0; i < len; i++) {
      const { value: idStr, size: idStrSize } = readString(buf, offset); // identifier
      offset += idStrSize;

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
    console.log(result);
    return result;
  }
}
