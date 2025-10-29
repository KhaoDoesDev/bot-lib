import {
  readVarInt,
  writeVarInt,
} from "../../datatypes";
import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundTickingStep extends Packet {
  static override id = 0x79;
  static override state = States.PLAY;

  constructor(public tickSteps: number) { 
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeVarInt(this.tickSteps), 
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundTickingStep {
    let offset = 0;

    const { value: tickSteps, size: tickStepsBufSize } = readVarInt(buf, offset);
    offset += tickStepsBufSize;

    return new ClientboundTickingStep(tickSteps);
  }
}
