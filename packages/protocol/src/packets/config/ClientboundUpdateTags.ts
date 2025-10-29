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

    const { value: groupsCount, size: groupsCountBufSize } = readVarInt(
      buf,
      offset
    );
    offset += groupsCountBufSize;

    const groups: TagGroup[] = Array.from({ length: groupsCount }, () => {
      const { value: registry, size: registryBufSize } = readString(buf, offset);
      offset += registryBufSize;

      const { value: tagCount, size: tagCountBufSize } = readVarInt(
        buf,
        offset
      );
      offset += tagCountBufSize;

      const tags: Tag[] = Array.from({ length: tagCount }, () => {
        const { value: tagName, size: tagNameBufSize } = readString(buf, offset);
        offset += tagNameBufSize;

        const { value: valueCount, size: valueCountBufSize } = readVarInt(
          buf,
          offset
        );
        offset += valueCountBufSize;

        const values: number[] = Array.from({ length: valueCount }, () => {
          const { value: value, size: valueBufSize } = readVarInt(buf, offset);
          offset += valueBufSize;
          return value;
        });

        return { tagName, values };
      });

      return { registry, tags };
    });

    return new ClientboundUpdateTags(groups);
  }
}
