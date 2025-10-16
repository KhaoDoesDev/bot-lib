import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readString,
  readVarInt,
  writeString,
  writeVarInt,
} from "../../datatypes";

export type Tag = {
  tagName: string;
  values: number[];
};

export type TagGroup = {
  registry: string;
  tags: Tag[];
};

export class ClientboundUpdateTags extends Packet {
  static override id = 0x0d;
  static override state = States.CONFIG;

  constructor(public groups: TagGroup[]) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.groups.length),
      ...this.groups.flatMap((pack) => [
        writeString(pack.registry),
        writeVarInt(pack.tags.length),
        ...pack.tags.flatMap((tag) => [
          writeString(tag.tagName),
          writeVarInt(tag.values.length),
          ...tag.values.map((value) => writeVarInt(value)),
        ]),
      ]),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundUpdateTags {
    let offset = 0;

    const { value: groupsCount, size: groupsCountLength } = readVarInt(
      buf,
      offset
    );
    offset += groupsCountLength;

    const groups: TagGroup[] = Array.from({ length: groupsCount }, () => {
      const { value: registry, size: registrySize } = readString(buf, offset);
      offset += registrySize;

      const { value: tagCount, size: tagCountVarIntLength } = readVarInt(
        buf,
        offset
      );
      offset += tagCountVarIntLength;

      const tags: Tag[] = Array.from({ length: tagCount }, () => {
        const { value: tagName, size: tagNameSize } = readString(buf, offset);
        offset += tagNameSize;

        const { value: valueCount, size: valueCountVarIntLength } = readVarInt(
          buf,
          offset
        );
        offset += valueCountVarIntLength;

        const values: number[] = Array.from({ length: valueCount }, () => {
          const { value: value, size: valueSize } = readVarInt(buf, offset);
          offset += valueSize;
          return value;
        });

        return { tagName, values };
      });

      return { registry, tags };
    });

    return new ClientboundUpdateTags(groups);
  }
}
