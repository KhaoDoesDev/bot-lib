import { Packet } from "../Packet";
import {
  readString,
  readUUID,
  writeString,
  writeUUID,
  writeBoolean,
  writeVarInt,
  readVarInt,
} from "../../datatypes";
import { GameProfile } from "auth";
import { States } from "../../types";

export class ClientboundLoginFinished extends Packet {
  static override id = 0x02;
  static override state = States.LOGIN;

  constructor(public profile: GameProfile) {
    super();
  }

  serialize(): Buffer {
    const { uuid, username, properties } = this.profile;

    const propsArray = Array.from(properties.entries());
    const propsCountBuf = writeVarInt(propsArray.length);

    const propsBufs = propsArray.map(([name, prop]) => {
      const base = [
        writeString(name),
        writeString(prop.value),
        writeBoolean(!!prop.signature),
      ];
      if (prop.signature) base.push(writeString(prop.signature));
      return Buffer.concat(base);
    });

    return Buffer.concat([
      writeUUID(uuid),
      writeString(username),
      propsCountBuf,
      ...propsBufs,
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundLoginFinished {
    let offset = 0;

    const { value: uuid, size: s1 } = readUUID(buf, offset);
    offset += s1;

    const { value: username, size: s2 } = readString(buf, offset);
    offset += s2;

    const { value: propCount, size: s3 } = readVarInt(buf, offset);
    offset += s3;

    const properties = new Map<string, { value: string; signature?: string }>();

    for (let i = 0; i < propCount; i++) {
      const { value: name, size: s4 } = readString(buf, offset);
      offset += s4;

      const { value, size: s5 } = readString(buf, offset);
      offset += s5;

      const hasSignature = buf.readUInt8(offset++) === 1;
      let signature: string | undefined;

      if (hasSignature) {
        const { value: sig, size: s6 } = readString(buf, offset);
        offset += s6;
        signature = sig;
      }

      properties.set(name, { value, signature });
    }

    const profile = new GameProfile(uuid, username, properties);
    return new ClientboundLoginFinished(profile);
  }
}
