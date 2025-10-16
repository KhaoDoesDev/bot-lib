import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readString,
  writeString,
} from "../../datatypes";

export class ClientboundCustomPayload extends Packet {
  static override id = 0x01;
  static override state = States.CONFIG;

  constructor(public identifier: string, public data: any) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeString(this.identifier),
      Buffer.from(this.data)
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundCustomPayload {
    let offset = 0;

    const { value: identifier, size: identifierSize } = readString(buf, offset); 
    offset += identifierSize;

    return new ClientboundCustomPayload(identifier, buf.slice(offset));
  }
}
