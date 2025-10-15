import EventEmitter from "events";
import { Socket } from "net";
import { writeVarInt } from "./datatypes";
import { Packet } from "./packets/Packet";

export class Connection extends EventEmitter {
  private buffer: Buffer = Buffer.alloc(0);
  private compressionThreshold: number | null = null;

  constructor(public socket: Socket) {
    super();
  }

  setCompressionThreshold(threshold: number) {
    this.compressionThreshold = threshold;
  }

  async writePacket(packet: Packet) {
    const payload = packet.serialize();
    const idBuf = writeVarInt((packet.constructor as any).id);
    const full = Buffer.concat([idBuf, payload]);

    const lengthBuf = writeVarInt(full.length);
    this.socket.write(Buffer.concat([lengthBuf, full]));
  }

  // async readPacket(): Promise<Packet> {
    // i can't figure this shit out, give me a break.
  // }
}
