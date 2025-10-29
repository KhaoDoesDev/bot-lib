import { Packet } from "../Packet";
import {
  writeVarInt,
  writeString,
  writeShort,
  readVarInt,
  readString,
  readShort,
} from "../../datatypes";
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

    const { value: protocolVersion, size: protocolVersionBufSize } = readVarInt(
      buf,
      offset
    );
    offset += protocolVersionBufSize;
    const { value: hostname, size: hostnameBufSize } = readString(buf, offset);
    offset += hostnameBufSize;
    const port = readShort(buf, offset);
    offset += 2;
    const { value: intention, size: intentionBufSize } = readVarInt(
      buf,
      offset
    );
    offset += intentionBufSize;

    return new ServerboundIntention(protocolVersion, hostname, port, intention);
  }
}
