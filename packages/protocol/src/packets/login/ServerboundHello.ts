import { Packet } from "../Packet";
import { readString, readUUID, writeString, writeUUID } from "../../datatypes";
import { States } from "../../types";

export class ServerboundHello extends Packet {
  static override id = 0x00;
  static override state = States.LOGIN;

  constructor(public username: string, public uuid: string) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([writeString(this.username), writeUUID(this.uuid)]);
  }

  static override deserialize(buf: Buffer): ServerboundHello {
    let offset = 0;
    const { value: username, size: s1 } = readString(buf, offset);
    offset += s1;
    const { value: uuid, size: s2 } = readUUID(buf, offset);
    offset += s2;

    return new ServerboundHello(username, uuid);
  }
}
