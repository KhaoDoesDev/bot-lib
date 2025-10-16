import EventEmitter from "events";
import { Socket } from "net";
import { readVarInt, writeVarInt } from "./datatypes";
import { Packet } from "./packets/Packet";
import * as zlib from "zlib";
import { clientboundPackets } from "./packets";
import { States } from "./types";

export class Client extends EventEmitter {
  private buffer: Buffer = Buffer.alloc(0);
  public compressionThreshold: number = 0;
  public state: States = States.HANDSHAKE;
  public socket: Socket;

  constructor(public host: string, public port: number) {
    super();
    this.socket = new Socket();
    this.socket.connect(port, host);
    this.socket.on("data", (data) => this.handlePacket(data));
  }

  async writePacket(packet: Packet) {
    const payload = packet.serialize();
    const idBuf = writeVarInt((packet.constructor as any).id);
    let full = Buffer.concat([idBuf, payload]);

    if (this.compressionThreshold > 0) {
      if (full.length >= this.compressionThreshold) {
        const compressed = zlib.deflateSync(full);
        const uncompressedLength = writeVarInt(full.length);
        full = Buffer.concat([uncompressedLength, compressed]);
      } else {
        const zero = writeVarInt(0);
        full = Buffer.concat([zero, full]);
      }
    }

    const lengthBuf = writeVarInt(full.length);
    this.socket.write(Buffer.concat([lengthBuf, full]));
  }

  async handlePacket(chunk: Buffer) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    while (true) {
      const lengthInfo = readVarInt(this.buffer, 0);
      if (!lengthInfo) return;
      const totalLength = lengthInfo.value;
      const startOffset = lengthInfo.size;

      if (this.buffer.length < startOffset + totalLength) {
        return;
      }

      let packetData = this.buffer.subarray(
        startOffset,
        startOffset + totalLength
      );
      this.buffer = this.buffer.subarray(startOffset + totalLength);

      if (this.compressionThreshold > 0) {
        const dataLengthInfo = readVarInt(packetData, 0);
        const dataLength = dataLengthInfo.value;
        const dataOffset = dataLengthInfo.size;

        if (dataLength > 0) {
          const compressed = packetData.subarray(dataOffset);
          packetData = zlib.inflateSync(compressed);
        } else {
          packetData = packetData.subarray(dataOffset);
        }
      }

      const { value: packetId, size: packetIdSize } = readVarInt(packetData, 0);
      const payload = packetData.subarray(packetIdSize);

      const PacketClass = clientboundPackets.find(
        (cls) => cls.id === packetId && cls.state === this.state
      ) as typeof Packet | undefined;

      if (!PacketClass) {
        this.emit("unhandledPacket", packetId, payload);
        continue;
      }

      try {
        const packet = PacketClass.deserialize(payload);
        this.emit("packet", packet);
      } catch (err) {
        this.emit("packetError", err, packetId);
      }
    }
  }
}
