import { Packet } from "../Packet";
import { writeVarInt, writeString, writeShort, readVarInt, readString } from "../../datatypes";
import { States } from "../../types";

export class ServerboundIntention extends Packet {
  static override id = 0x00;
  static override state = States.HANDSHAKE;

  constructor(
    public protocolVersion: number,
    public hostname: string,
    public port: number,
    public intention: number
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.protocolVersion),
      writeString(this.hostname),
      writeShort(this.port),
      writeVarInt(this.intention),
    ]);
  }

  static override deserialize(buf: Buffer): ServerboundIntention {
    let offset = 0;
    const { value: protocolVersion, size: s1 } = readVarInt(buf, offset);
    offset += s1;
    const { value: hostname, size: s2 } = readString(buf, offset);
    offset += s2;
    const port = buf.readUInt16BE(offset);
    offset += 2;
    const { value: intention, size: s3 } = readVarInt(buf, offset);
    offset += s3;

    return new ServerboundIntention(protocolVersion, hostname, port, intention);
  }
}
