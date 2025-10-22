import { Buffer } from "buffer";
import type { States } from "../types";

export abstract class Packet {
  static id: number;
  static state: States;

  abstract serialize(): Buffer;
  static deserialize(buf: Buffer): Packet | Promise<Packet> {
    throw new Error("deserialize not implemented here");
  }
}
