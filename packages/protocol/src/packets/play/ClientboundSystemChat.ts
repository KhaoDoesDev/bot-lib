import { Packet } from "../Packet";
import { States } from "../../types";
import { decode, encode } from "nbt-ts";
import ChatMessage from "chat";
import { readBoolean, writeBoolean, writeString } from "../../datatypes";

export class ClientboundSystemChat extends Packet {
  static override id = 0x72;
  static override state = States.PLAY;

  constructor(public content: ChatMessage | string, public overlay: boolean) {
    super();
  }

  serialize(): Buffer {
    const buffers: Buffer[] = [];

    if (typeof this.content === "string") {
      buffers.push(writeString(this.content));
    } else {
      const jsonEntries = Object.entries(this.content.json);
      const encodedEntries = jsonEntries.map(([key, val]) => encode(key, val));
      buffers.push(...encodedEntries);
    }

    buffers.push(writeBoolean(this.overlay));

    return Buffer.concat(buffers);
  }

  static override deserialize(buf: Buffer): ClientboundSystemChat {
    let offset = 1;
    const contentArray = [];
    while (offset < buf.length - 1) {
      const content = decode(buf.subarray(offset, buf.length - 1));
      offset += content.length;
      if (!content.name && !content.value) break;
      contentArray.push(content);
    }
    const content: Record<string, any> = {};
    for (const c of contentArray) {
      content[c.name!] = c.value;
    }

    const chatMessage = new ChatMessage(
      contentArray.length > 0
        ? content
        : buf // TODO: make sure this works
            .subarray(3, buf.length - 1)
            .toString("utf-8")
            .trim()
    );

    return new ClientboundSystemChat(chatMessage, readBoolean(buf, offset));
  }
}
