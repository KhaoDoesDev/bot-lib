import { States } from "../../types";
import { Packet } from "../Packet";
import { readVarInt, writeVarInt } from "../../datatypes";

export class ClientboundSetSimulationDistance extends Packet {
  static override id = 0x68;
  static override state = States.PLAY;

  constructor(public simulationDistance: number) {
    super();
  }

  serialize(): Buffer {
    return writeVarInt(this.simulationDistance);
  }

  static override deserialize(buf: Buffer): ClientboundSetSimulationDistance {
    return new ClientboundSetSimulationDistance(
      readVarInt(buf, 0).value
    );
  }
}
