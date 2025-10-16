import {
  readBoolean,
  readByte,
  readInt,
  readLong,
  readString,
  readVarInt,
  writeBoolean,
  writeByte,
  writeInt,
  writeLong,
  writeString,
  writeVarInt,
} from "../../datatypes";
import { GameModes, States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundLogin extends Packet {
  static override id = 0x2b;
  static override state = States.PLAY;

  constructor(
    public entityId: number,
    public isHardcore: boolean,
    public diamensionNames: string[],
    public maxPlayers: number,
    public viewDistance: number,
    public simulationDistance: number,
    public reducedDebugInfo: boolean,
    public enableRespawnScreen: boolean,
    public doLimitedCrafting: boolean,
    public dimensionType: number,
    public dimensionName: string,
    public hashedSeed: bigint,
    public gameMode: GameModes,
    public previousGameMode: GameModes | null,
    public isDebug: boolean,
    public isFlat: boolean,
    public hasDeathLocation: boolean,
    public deathDimensionName: string | null,
    public deathLocation: number[] | null,
    public portalCooldown: number,
    public seaLevel: number,
    public enforcesSecureChat: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeInt(this.entityId),
      writeBoolean(this.isHardcore),
      writeInt(this.diamensionNames.length),
      ...this.diamensionNames.map((name) => Buffer.from(name)),
      writeVarInt(this.maxPlayers),
      writeVarInt(this.viewDistance),
      writeVarInt(this.simulationDistance),
      writeBoolean(this.reducedDebugInfo),
      writeBoolean(this.enableRespawnScreen),
      writeBoolean(this.doLimitedCrafting),
      writeVarInt(this.dimensionType),
      writeString(this.dimensionName),
      writeLong(this.hashedSeed),
      writeByte(this.gameMode),
      writeByte(this.previousGameMode ?? -1),
      writeBoolean(this.isDebug),
      writeBoolean(this.isFlat),
      writeBoolean(this.hasDeathLocation),
      this.hasDeathLocation && this.deathDimensionName
        ? writeString(this.deathDimensionName)
        : Buffer.alloc(0),
      this.hasDeathLocation && this.deathLocation
        ? writeInt(this.deathLocation.length)
        : Buffer.alloc(0),
      this.hasDeathLocation && this.deathLocation
        ? Buffer.concat(this.deathLocation.map((value) => writeInt(value)))
        : Buffer.alloc(0),
      writeVarInt(this.portalCooldown),
      writeVarInt(this.seaLevel),
      writeBoolean(this.enforcesSecureChat),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundLogin {
    let offset = 0;

    const entityId = readInt(buf, offset++);
    const { value: isHardcore } = readBoolean(buf, offset++);
    const diamensionNamesCount = readInt(buf, offset++);

    const diamensionNames: string[] = Array.from(
      { length: diamensionNamesCount },
      () => {
        const { value: name, size: s3 } = readString(buf, offset);
        offset += s3;
        return name;
      }
    );

    const { value: maxPlayers, size: s4 } = readVarInt(buf, offset);
    offset += s4;
    const { value: viewDistance, size: s5 } = readVarInt(buf, offset);
    offset += s5;
    const { value: simulationDistance, size: s6 } = readVarInt(buf, offset);
    offset += s6;
    const { value: reducedDebugInfo } = readBoolean(buf, offset++);
    const { value: enableRespawnScreen } = readBoolean(buf, offset++);
    const { value: doLimitedCrafting } = readBoolean(buf, offset++);
    const { value: dimensionType, size: s7 } = readVarInt(buf, offset);
    offset += s7;
    const { value: dimensionName, size: s8 } = readString(buf, offset);
    offset += s8;
    const hashedSeed = readLong(buf, offset++);
    const gameMode = readByte(buf, offset++);
    const previousGameMode = readByte(buf, offset++);
    const { value: isDebug } = readBoolean(buf, offset++);
    const { value: isFlat } = readBoolean(buf, offset++);
    const { value: hasDeathLocation } = readBoolean(buf, offset++);

    let deathDimensionName: string | null = null;
    let deathLocation: number[] | null = null;

    if (hasDeathLocation) {
      const { value: deathDimensionNameStr, size: s12 } = readString(
        buf,
        offset
      );
      offset += s12;
      deathDimensionName = deathDimensionNameStr;
      const deathLocationCount = readInt(buf, offset++);
      deathLocation = Array.from({ length: deathLocationCount }, () =>
        readInt(buf, offset++)
      );
    }

    const { value: portalCooldown, size: s14 } = readVarInt(buf, offset);
    offset += s14;
    const { value: seaLevel, size: s15 } = readVarInt(buf, offset);
    offset += s15;
    const { value: enforcesSecureChat } = readBoolean(buf, offset++);

    return new ClientboundLogin(
      entityId,
      isHardcore,
      diamensionNames,
      maxPlayers,
      viewDistance,
      simulationDistance,
      reducedDebugInfo,
      enableRespawnScreen,
      doLimitedCrafting,
      dimensionType,
      dimensionName,
      hashedSeed,
      gameMode,
      previousGameMode,
      isDebug,
      isFlat,
      hasDeathLocation,
      deathDimensionName,
      deathLocation,
      portalCooldown,
      seaLevel,
      enforcesSecureChat
    );
  }
}
