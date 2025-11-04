import { Packet } from "../Packet";
import {
  readVarInt,
  writeVarInt,
  readString,
  writeString,
  writeDouble,
  writeByte,
  readDouble,
  readByte,
} from "../../datatypes";
import { States } from "../../types";

export type Attribute = {
  id: number;
  value: number;
  modifiers: AttributeModifier[];
};

export type AttributeModifier = {
  id: string;
  amount: number;
  operation: number;
};

export class ClientboundUpdateAttributes extends Packet {
  static override id = 0x7c;
  static override state = States.PLAY;

  constructor(
    public entityId: number,
    public properties: Attribute[] = [],
  ) {
    super();
  }

  serialize(): Buffer {
    const buffers: Buffer[] = [];

    buffers.push(writeVarInt(this.properties.length));
    for (const property of this.properties) {
      buffers.push(writeVarInt(property.id));
      buffers.push(writeDouble(property.value));
      for (const modifier of property.modifiers) {
        buffers.push(writeString(modifier.id));
        buffers.push(writeDouble(modifier.amount));
        buffers.push(writeByte(modifier.operation));
      }
    }

    return Buffer.concat(buffers);
  }

  static override deserialize(buf: Buffer): ClientboundUpdateAttributes {
    let offset = 0;

    const { value: entityId, size: entityIdBufSize } = readVarInt(buf, offset);
    offset += entityIdBufSize;

    const properties: Attribute[] = [];
    const { value: propertiesCount, size: propertiesCountBufSize } =
      readVarInt(buf, offset);
    offset += propertiesCountBufSize;

    for (let i = 0; i < propertiesCount; i++) {
      const { value: id, size: idBufSize } = readVarInt(buf, offset);
      offset += idBufSize;

      const value = readDouble(buf, offset);
      offset += 8;

      const { value: modifierCount, size: modifierCountBufSize } =
        readVarInt(buf, offset);
      offset += modifierCountBufSize;

      const modifiers: AttributeModifier[] = [];
      for (let j = 0; j < modifierCount; j++) {
        const { value: id, size: idBufSize } = readString(buf, offset);
        offset += idBufSize;
        const amount = readDouble(buf, offset);
        offset += 8;
        const operation = readByte(buf, offset);
        offset += 1;
        modifiers.push({ id, amount, operation });
      }

      properties.push({ id, value, modifiers });
    }

    return new ClientboundUpdateAttributes(entityId, properties);
  }
}
