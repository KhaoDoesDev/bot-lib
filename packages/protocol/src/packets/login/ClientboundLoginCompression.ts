import { Packet } from "../Packet";
import { readVarInt, writeVarInt } from "../../datatypes";
import { States } from "../../types";

export class ClientboundLoginCompression extends Packet {
  static override id = 0x03;
  static override state = States.LOGIN;

  constructor(public threshold: number) {
    super();
  }

  serialize(): Buffer {
    return writeVarInt(this.threshold);
  }

  static override deserialize(buf: Buffer): ClientboundLoginCompression {
    const { value: threshold } = readVarInt(buf, 0);
    return new ClientboundLoginCompression(threshold);
  }
}
