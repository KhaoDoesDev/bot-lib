import { Buffer } from "buffer";

/** WRITERS **/

export function writeBoolean(value: boolean): Buffer {
  return Buffer.from([value ? 1 : 0]);
}

export function writeByte(value: number): Buffer {
  const buf = Buffer.alloc(1);
  buf.writeInt8(value);
  return buf;
}

export function writeUnsignedByte(value: number): Buffer {
  const buf = Buffer.alloc(1);
  buf.writeUInt8(value);
  return buf;
}

export function writeShort(value: number): Buffer {
  const buf = Buffer.alloc(2);
  buf.writeInt16BE(value);
  return buf;
}

export function writeUnsignedShort(value: number): Buffer {
  const buf = Buffer.alloc(2);
  buf.writeUInt16BE(value);
  return buf;
}

export function writeInt(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeInt32BE(value);
  return buf;
}

export function writeLong(value: bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(value);
  return buf;
}

export function writeFloat(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeFloatBE(value);
  return buf;
}

export function writeDouble(value: number): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeDoubleBE(value);
  return buf;
}

export function writeVarInt(value: number): Buffer {
  const bytes: number[] = [];
  do {
    let temp = value & 0b01111111;
    value >>>= 7;
    if (value !== 0) temp |= 0b10000000;
    bytes.push(temp);
  } while (value !== 0);
  return Buffer.from(bytes);
}

export function writeVarLong(value: bigint): Buffer {
  const bytes: number[] = [];
  do {
    // mask 0x7F as BigInt:
    let temp = Number(value & 0x7fn);
    value >>= 7n;
    if (value !== 0n) temp |= 0x80;
    bytes.push(temp);
  } while (value !== 0n);
  return Buffer.from(bytes);
}

export function writeString(str: string): Buffer {
  const strBuf = Buffer.from(str, "utf8");
  const len = writeVarInt(strBuf.length);
  return Buffer.concat([len, strBuf]);
}

export function writeUUID(uuid: string): Buffer {
  const hex = uuid.replace(/-/g, "");
  return Buffer.from(hex, "hex");
}

/** READERS **/

export function readVarInt(buffer: Buffer): { value: number; length: number } {
  let value = 0;
  let length = 0;
  let currentByte: any;

  do {
    currentByte = buffer[length];
    value |= (currentByte & 0b01111111) << (7 * length);
    length++;
    if (length > 5) {
      throw new Error("VarInt is too big");
    }
  } while ((currentByte & 0b10000000) != 0);

  return { value, length };
}