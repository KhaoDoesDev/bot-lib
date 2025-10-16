import { readBoolean, writeBoolean } from "../../datatypes";
import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundRecipeBookSettings extends Packet {
  static override id = 0x45;
  static override state = States.PLAY;

  constructor(
    public craftingBookOpen: boolean,
    public craftingBookFilterActive: boolean,
    public smeltingBookOpen: boolean,
    public smeltingBookFilterActive: boolean,
    public blastFurnaceOpen: boolean,
    public blastFurnaceFilterActive: boolean,
    public smokerOpen: boolean,
    public smokerFilterActive: boolean
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeBoolean(this.craftingBookOpen),
      writeBoolean(this.craftingBookFilterActive),
      writeBoolean(this.smeltingBookOpen),
      writeBoolean(this.smeltingBookFilterActive),
      writeBoolean(this.blastFurnaceOpen),
      writeBoolean(this.blastFurnaceFilterActive),
      writeBoolean(this.smokerOpen),
      writeBoolean(this.smokerFilterActive),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundRecipeBookSettings {
    return new ClientboundRecipeBookSettings(
      readBoolean(buf, 0),
      readBoolean(buf, 1),
      readBoolean(buf, 2),
      readBoolean(buf, 3),
      readBoolean(buf, 4),
      readBoolean(buf, 5),
      readBoolean(buf, 6),
      readBoolean(buf, 7)
    );
  }
}
