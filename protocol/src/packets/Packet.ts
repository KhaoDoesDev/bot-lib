import { Buffer } from "buffer";

export abstract class Packet {
  static id: number;

  abstract serialize(): Buffer;
  static deserialize(buf: Buffer): Packet {
    throw new Error("deserialize not implemented here");
  }
}
