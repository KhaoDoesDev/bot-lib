import { Packet } from "../Packet";
import { States } from "../../types";
import { readByte, readFloat, writeByte, writeFloat } from "../../datatypes";

export class ClientboundPlayerAbilities extends Packet {
  static override id = 0x39;
  static override state = States.PLAY;

  private static FLAGS = {
    invulnerable: 0x01,
    flying: 0x02,
    allowFlying: 0x04,
    creativeMode: 0x08,
  };

  public flags: number;

  constructor(
    flags: Flags,
    public flyingSpeed: number,
    public fieldOfViewModifier: number
  ) {
    super();
    this.flags = 0;
    for (const key in flags) {
      if (flags[key as keyof Flags]) {
        this.flags |= ClientboundPlayerAbilities.FLAGS[key as keyof Flags];
      }
    }
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeByte(this.flags),
      writeFloat(this.flyingSpeed),
      writeFloat(this.fieldOfViewModifier),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundPlayerAbilities {
    let offset = 0;

    const flags = readByte(buf, offset);
    offset += 1;
    const flyingSpeed = readFloat(buf, offset);
    offset += 4;
    const fieldOfViewModifier = readFloat(buf, offset);
    offset += 4;

    return new ClientboundPlayerAbilities(
      ClientboundPlayerAbilities.bitfieldToFlags(flags),
      flyingSpeed,
      fieldOfViewModifier
    );
  }

  static bitfieldToFlags(bitfield: number): Flags {
    const result: Flags = {};
    for (const key in ClientboundPlayerAbilities.FLAGS) {
      const flag = ClientboundPlayerAbilities.FLAGS[key as keyof Flags];
      result[key as keyof Flags] = (bitfield & flag) !== 0;
    }
    return result;
  }
}

export type Flags = {
  invulnerable?: boolean;
  flying?: boolean;
  allowFlying?: boolean;
  creativeMode?: boolean;
};
