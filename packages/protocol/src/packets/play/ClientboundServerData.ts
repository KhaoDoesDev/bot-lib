import { Packet } from "../Packet";
import { States } from "../../types";
import { readVarInt, writeVarInt } from "../../datatypes";

export class ClientboundServerData extends Packet {
  static override id = 0x4f;
  static override state = States.PLAY;

  constructor(public motd: string, public icon?: Buffer) {
    super();
  }

  serialize(): Buffer {
    const motdStr = Buffer.from(this.motd, "utf8");
    const motdTag = Buffer.alloc(1 + 2 + motdStr.length + 1);
    motdTag.writeUInt8(0x08, 0);
    motdTag.writeUInt16BE(motdStr.length, 1);
    motdStr.copy(motdTag, 3);
    motdTag.writeUInt8(0x00, 3 + motdStr.length);

    const iconBuf = this.icon
      ? Buffer.concat([writeVarInt(this.icon.length), this.icon])
      : writeVarInt(0);

    return Buffer.concat([motdTag, iconBuf]);
  }

  static override deserialize(buf: Buffer): ClientboundServerData {
    let offset = 0;

    const tagType = buf.readUInt8(offset++);
    if (tagType !== 0x08) {
      throw new Error(`Unexpected tag type: ${tagType}`);
    }

    const motdLength = buf.readUInt16BE(offset);
    offset += 2;

    const motd = buf.subarray(offset, offset + motdLength).toString("utf8");
    offset += motdLength;

    if (buf[offset] === 0x00) offset++;

    const { value: iconLength, size: iconLengthBufSize } = readVarInt(
      buf,
      offset
    );
    offset += iconLengthBufSize;

    let icon: Buffer | undefined;
    if (iconLength > 0) {
      icon = buf.subarray(offset, offset + iconLength);
      offset += iconLength;
    }

    return new ClientboundServerData(motd, icon);
  }
}
