import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readString,
  readVarInt,
  writeString,
  writeVarInt,
} from "../../datatypes";
import { encode, decode, type Tag } from "nbt-ts";

export type RegistryEntry = {
  id: string;
  data?: Tag | null;
};

export class ClientboundRegistryData extends Packet {
  static override id = 0x07;
  static override state = States.CONFIG;

  constructor(
    public registryId: string,
    public entries: RegistryEntry[] = []
  ) {
    super();
  }

  serialize(): Buffer {
    const buffers: Buffer[] = [];

    buffers.push(writeString(this.registryId));

    buffers.push(writeVarInt(this.entries.length));

    for (const entry of this.entries) {
      buffers.push(writeString(entry.id));

      if (entry.data) {
        const nbtBuffer = encode(null, entry.data);
        buffers.push(Buffer.from([1]));
        buffers.push(nbtBuffer);
      } else {
        buffers.push(Buffer.from([0]));
      }
    }

    return Buffer.concat(buffers);
  }

  static override deserialize(buf: Buffer): ClientboundRegistryData {
    let offset = 0;

    const { value: registryId, size: registryIdSize } = readString(buf, offset);
    offset += registryIdSize;

    const { value: len, size: lenSize } = readVarInt(buf, offset);
    offset += lenSize;

    const entries: RegistryEntry[] = [];

    for (let i = 0; i < len; i++) {
      const { value: idStr, size: idStrSize } = readString(buf, offset);
      offset += idStrSize;

      const hasNbt = buf.readUInt8(offset++);
      let nbtData: Tag | null = null;

      if (hasNbt) {
        const decoded = decode(buf.subarray(offset));
        nbtData = decoded.value;
        offset += decoded.length;
      }

      entries.push({ id: idStr, data: nbtData });
    }

    return new ClientboundRegistryData(registryId, entries);
  }
}
