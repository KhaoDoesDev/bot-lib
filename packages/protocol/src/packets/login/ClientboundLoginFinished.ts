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

    const { value: uuid, size: uuidBufSize } = readUUID(buf, offset);
    offset += uuidBufSize;

    const { value: username, size: usernameBufSize } = readString(buf, offset);
    offset += usernameBufSize;

    const { value: propCount, size: propCountBufSize } = readVarInt(
      buf,
      offset
    );
    offset += propCountBufSize;

    const properties = new Map<string, { value: string; signature?: string }>();

    for (let i = 0; i < propCount; i++) {
      const { value: name, size: nameBufSize } = readString(buf, offset);
      offset += nameBufSize;

      const { value, size: valueBufSize } = readString(buf, offset);
      offset += valueBufSize;

      const hasSignature = buf.readUInt8(offset++) === 1;
      let signature: string | undefined;

      if (hasSignature) {
        const { value: signatureStr, size: signatureStrBufSize } = readString(
          buf,
          offset
        );
        offset += signatureStrBufSize;
        signature = signatureStr;
      }

      properties.set(name, { value, signature });
    }

    const profile = new GameProfile(uuid, username, properties);
    return new ClientboundLoginFinished(profile);
  }
}
