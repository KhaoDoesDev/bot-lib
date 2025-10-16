import { Packet } from "../Packet";
import { States } from "../../types";
import {
  readBoolean,
  readByte,
  readString,
  readVarInt,
  writeBoolean,
  writeByte,
  writeString,
  writeVarInt,
} from "../../datatypes";

export class ServerboundClientInformation extends Packet {
  static override id = 0x00;
  static override state = States.CONFIG;

  private static SKIN_PARTS_FLAGS = {
    cape: 0x01,
    jacket: 0x02,
    leftSleeve: 0x04,
    rightSleeve: 0x08,
    leftPants: 0x10,
    rightPants: 0x20,
    hat: 0x40,
  };

  public displayedSkinParts: number;

  constructor(
    public locale: string,
    public viewDistance: number,
    public chatMode: number,
    public chatColors: boolean,
    skinParts: SkinParts,
    public mainHand: number,
    public enableTextFiltering: boolean,
    public allowServerListing: boolean,
    public particleStatus: number
  ) {
    super();
    this.displayedSkinParts = 0;
    for (const key in skinParts) {
      if (skinParts[key as keyof SkinParts]) {
        this.displayedSkinParts |=
          ServerboundClientInformation.SKIN_PARTS_FLAGS[key as keyof SkinParts];
      }
    }
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeString(this.locale),
      writeByte(this.viewDistance),
      writeVarInt(this.chatMode),
      writeBoolean(this.chatColors),
      writeByte(this.displayedSkinParts),
      writeVarInt(this.mainHand),
      writeBoolean(this.enableTextFiltering),
      writeBoolean(this.allowServerListing),
      writeVarInt(this.particleStatus),
    ]);
  }

  static override deserialize(buf: Buffer): ServerboundClientInformation {
    let offset = 0;

    const { value: locale, size: s1 } = readString(buf, offset);
    offset += s1;

    const viewDistance = readByte(buf, offset++);
    const { value: chatMode, size: s3 } = readVarInt(buf, offset);
    offset += s3;

    const chatColors = readBoolean(buf, offset++); 
    const displayedSkinParts = readByte(buf, offset++);

    const { value: mainHand, size: s6 } = readVarInt(buf, offset);
    offset += s6;

    const enableTextFiltering = readBoolean(buf, offset++);
    const allowServerListing = readBoolean(buf, offset++);
    const { value: particleStatus } = readVarInt(buf, offset);

    return new ServerboundClientInformation(
      locale,
      viewDistance,
      chatMode,
      chatColors,
      ServerboundClientInformation.bitfieldToSkinParts(displayedSkinParts),
      mainHand,
      enableTextFiltering,
      allowServerListing,
      particleStatus
    );
  }

  static bitfieldToSkinParts(bitfield: number): SkinParts {
    const result: SkinParts = {};
    for (const key in ServerboundClientInformation.SKIN_PARTS_FLAGS) {
      const flag =
        ServerboundClientInformation.SKIN_PARTS_FLAGS[key as keyof SkinParts];
      result[key as keyof SkinParts] = (bitfield & flag) !== 0;
    }
    return result;
  }
}

export type SkinParts = {
  cape?: boolean;
  jacket?: boolean;
  leftSleeve?: boolean;
  rightSleeve?: boolean;
  leftPants?: boolean;
  rightPants?: boolean;
  hat?: boolean;
};
