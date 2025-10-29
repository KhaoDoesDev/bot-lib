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
      ...this.diamensionNames.map((name) => writeString(name)),
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

    const entityId = readInt(buf, offset);
    offset += 4;
    const isHardcore = readBoolean(buf, offset);
    offset += 1;
    const { value: diamensionNamesCount, size: diamensionNamesCountBufSize } =
      readVarInt(buf, offset);
    offset += diamensionNamesCountBufSize;

    const diamensionNames: string[] = Array.from(
      { length: diamensionNamesCount },
      () => {
        const { value: name, size: s3 } = readString(buf, offset);
        offset += s3;
        return name;
      }
    );

    const { value: maxPlayers, size: maxPlayersBufSize } = readVarInt(
      buf,
      offset
    );
    offset += maxPlayersBufSize;
    const { value: viewDistance, size: viewDistanceBufSize } = readVarInt(
      buf,
      offset
    );
    offset += viewDistanceBufSize;
    const { value: simulationDistance, size: simulationDistanceBufSize } =
      readVarInt(buf, offset);
    offset += simulationDistanceBufSize;
    const reducedDebugInfo = readBoolean(buf, offset);
    offset += 1;
    const enableRespawnScreen = readBoolean(buf, offset);
    offset += 1;
    const doLimitedCrafting = readBoolean(buf, offset);
    offset += 1;
    const { value: dimensionType, size: dimensionTypeBufSize } = readVarInt(
      buf,
      offset
    );
    offset += dimensionTypeBufSize;
    const { value: dimensionName, size: dimensionNameBufSize } = readString(
      buf,
      offset
    );
    offset += dimensionNameBufSize;
    const hashedSeed = readLong(buf, offset);
    offset += 8;
    const gameMode = readByte(buf, offset);
    offset += 1;
    const previousGameMode = readByte(buf, offset);
    offset += 1;
    const isDebug = readBoolean(buf, offset);
    offset += 1;
    const isFlat = readBoolean(buf, offset);
    offset += 1;
    const hasDeathLocation = readBoolean(buf, offset);
    offset += 1;

    let deathDimensionName: string | null = null;
    let deathLocation: number[] | null = null;

    if (hasDeathLocation) {
      const {
        value: deathDimensionNameStr,
        size: deathDimensionNameStrBufSize,
      } = readString(buf, offset);
      offset += deathDimensionNameStrBufSize;
      deathDimensionName = deathDimensionNameStr;
      const deathLocationCount = readInt(buf, offset);
      offset += 4;
      deathLocation = Array.from({ length: deathLocationCount }, () => {
        const loc = readInt(buf, offset);
        offset += 4;
        return loc;
      });
    }

    const { value: portalCooldown, size: portalCooldownBufSize } = readVarInt(
      buf,
      offset
    );
    offset += portalCooldownBufSize;
    const { value: seaLevel, size: seaLevelBufSize } = readVarInt(buf, offset);
    offset += seaLevelBufSize;
    const enforcesSecureChat = readBoolean(buf, offset);
    offset += 1;

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
