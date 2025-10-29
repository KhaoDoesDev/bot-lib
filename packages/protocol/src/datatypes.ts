import { Buffer } from "buffer";
import { decode, type DecodeOptions, type DecodeResult } from "nbt-ts";
import { NBTData, read } from "nbtify";
import type { Position } from "./types";

export function readVarInt(
  buf: Buffer,
  offset = 0
): { value: number; size: number } {
  let num = 0,
    shift = 0,
    size = 0;
  while (true) {
    const byte = buf[offset + size]!;
    num |= (byte & 0x7f) << shift;
    size++;
    if ((byte & 0x80) === 0) break;
    shift += 7;
    if (shift >= 32) throw new Error("VarInt too big");
  }
  return { value: num, size };
}

export function writeVarInt(value: number): Buffer {
  const buf: number[] = [];
  do {
    let temp = value & 0x7f;
    value >>>= 7;
    if (value !== 0) temp |= 0x80;
    buf.push(temp);
  } while (value !== 0);
  return Buffer.from(buf);
}

export function readVarLong(buf: Buffer, offset = 0): { value: bigint; size: number } {
  let num = 0n;
  let shift = 0n;
  let size = 0;

  while (true) {
    const byte = buf[offset + size]!;
    num |= (BigInt(byte) & 0x7fn) << shift;
    size++;
    if ((byte & 0x80) === 0) break;
    shift += 7n;
    if (shift >= 64n) throw new Error("VarLong too big");
  }

  return { value: num, size };
}

export function writeVarLong(value: bigint): Buffer {
  const buf: number[] = [];
  do {
    let temp = Number(value & 0x7fn);
    value >>= 7n;
    if (value !== 0n) temp |= 0x80;
    buf.push(temp);
  } while (value !== 0n);
  return Buffer.from(buf);
}

export function readString(
  buf: Buffer,
  offset = 0
): { value: string; size: number } {
  const { value: len, size: lenSize } = readVarInt(buf, offset);
  const strBuf = buf.slice(offset + lenSize, offset + lenSize + len);
  return { value: strBuf.toString("utf-8"), size: lenSize + len };
}

export function writeString(str: string): Buffer {
  const strBuf = Buffer.from(str, "utf-8");
  return Buffer.concat([writeVarInt(strBuf.length), strBuf]);
}

export function readBoolean(buf: Buffer, offset = 0): boolean {
  return buf[offset] !== 0;
}

export function writeBoolean(val: boolean): Buffer {
  return Buffer.from([val ? 1 : 0]);
}

export function readUUID(
  buf: Buffer,
  offset = 0
): { value: string; size: number } {
  const high = buf.readBigUInt64BE(offset);
  const low = buf.readBigUInt64BE(offset + 8);
  return {
    value:
      high.toString(16).padStart(16, "0") + low.toString(16).padStart(16, "0"),
    size: 16,
  };
}

export function writeUUID(uuid: string): Buffer {
  const hex = uuid.replace(/-/g, "");
  return Buffer.from(hex, "hex");
}

export function readInt(buf: Buffer, offset = 0): number {
  return buf.readInt32BE(offset);
}
export function writeInt(val: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeInt32BE(val, 0);
  return buf;
}
export function readShort(buf: Buffer, offset = 0): number {
  return buf.readInt16BE(offset);
}
export function writeShort(val: number): Buffer {
  const buf = Buffer.alloc(2);
  buf.writeInt16BE(val, 0);
  return buf;
}
export function readByte(buf: Buffer, offset = 0): number {
  return buf.readInt8(offset);
}
export function writeByte(val: number): Buffer {
  return Buffer.from([val]);
}
export function readLong(buf: Buffer, offset = 0): bigint {
  return buf.readBigInt64BE(offset);
}
export function writeLong(val: bigint): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(val, 0);
  return buf;
}
export function readFloat(buf: Buffer, offset = 0): number {
  return buf.readFloatBE(offset);
}
export function writeFloat(val: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeFloatBE(val, 0);
  return buf;
}
export function readDouble(buf: Buffer, offset = 0): number {
  return buf.readDoubleBE(offset);
}
export function writeDouble(val: number): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeDoubleBE(val, 0);
  return buf;
}

export async function readNbt(
  buffer: Buffer,
  option?: DecodeOptions
): Promise<DecodeResult | null> {
  let sliceSize = 1;

  while (sliceSize <= buffer.length) {
    const slice = buffer.subarray(0, sliceSize);

    try {
      const nbt = await decode(slice, option);
      return nbt;
    } catch (err: any) {
      sliceSize += 1;
      continue;
    }
  }

  return null;
}

export function writePosition(x: number, y: number, z: number): Buffer {
  let xb = BigInt(x & 0x3FFFFFF);
  let yb = BigInt(y & 0xFFF);
  let zb = BigInt(z & 0x3FFFFFF);

  const value = (xb << 38n) | (zb << 12n) | yb;

  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(value);
  return buf;
}

export function readPosition(
  buf: Buffer,
  offset = 0
): Position {
  const value = buf.readBigInt64BE(offset);

  let x = Number(value >> 38n);
  let y = Number((value << 52n) >> 52n);
  let z = Number((value << 26n) >> 38n);

  if (x >= 1 << 25) x -= 1 << 26;
  if (y >= 1 << 11) y -= 1 << 12;
  if (z >= 1 << 25) z -= 1 << 26;

  return { x, y, z };
}