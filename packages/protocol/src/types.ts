import type { Packet } from "./packets/Packet";

export type Events = {
  packet: (packet: Packet) => void;
  unhandledPacket: (id: number, payload: Buffer) => void;
  packetError: (id: number, error: any) => void;
};

export enum Intentions {
  STATUS = 1,
  LOGIN = 2,
  TRANSFER = 3,
}

export enum States {
  HANDSHAKE,
  STATUS,
  LOGIN,
  CONFIG,
  PLAY,
}

export enum GameModes {
  SURVIVAL = 0,
  CREATIVE = 1,
  ADVENTURE = 2,
  SPECTATOR = 3,
}

export enum Difficulties {
  PEACEFUL = 0,
  EASY = 1,
  NORMAL = 2,
  HARD = 3,
}

export const TeleportFlags = {
  relativeX: 0x0001,
  relativeY: 0x0002,
  relativeZ: 0x0004,
  relativeYaw: 0x0008,
  relativePitch: 0x0010,
  relativeVelocityX: 0x0020,
  relativeVelocityY: 0x0040,
  relativeVelocityZ: 0x0080,
  rotateVelocity: 0x0100,
};

export type TeleportFlagsType = {
  relativeX?: boolean;
  relativeY?: boolean;
  relativeZ?: boolean;
  relativeYaw?: boolean;
  relativePitch?: boolean;
  relativeVelocityX?: boolean;
  relativeVelocityY?: boolean;
  relativeVelocityZ?: boolean;
  rotateVelocity?: boolean;
};

export function bitfieldToTeleportFlags(bitfield: number): TeleportFlagsType {
  const result: TeleportFlagsType = {};
  for (const key in TeleportFlags) {
    const flag = TeleportFlags[key as keyof TeleportFlagsType];
    result[key as keyof TeleportFlagsType] = (bitfield & flag) !== 0;
  }
  return result;
}
