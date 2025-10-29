import {
  readByte,
  readFloat,
  writeByte,
  writeFloat,
} from "../../datatypes";
import { States } from "../../types";
import { Packet } from "../Packet";

export class ClientboundGameEvent extends Packet {
  static override id = 0x22;
  static override state = States.PLAY;

  constructor(
    public event: number,
    public value: number,
  ) {
    super();
  }

  serialize(): Buffer {
    return Buffer.concat([
      writeByte(this.event),
      writeFloat(this.value),
    ]);
  }

  static override deserialize(buf: Buffer): ClientboundGameEvent {
    let offset = 0;

    const event = readByte(buf, offset);
    offset += 1;
    const value = readFloat(buf, offset);
    offset += 4;

    return new ClientboundGameEvent(event, value);
  }
}

/* Events:
0	No respawn block available
- Note: Displays message 'block.minecraft.spawn.not_valid' (You have no home bed or charged respawn anchor, or it was obstructed) to the player.

1	Begin raining	

2	End raining	

3	Change game mode
- 0: Survival, 1: Creative, 2: Adventure, 3: Spectator.

4	Win game	
- 0: Just respawn player.
- 1: Roll the credits and respawn player.
- Note that 1 is only sent by vanilla server when player has not yet achieved advancement "The end?", else 0 is sent.

5	Demo event
- 0: Show welcome to demo screen.
- 101: Tell movement controls.
- 102: Tell jump control.
- 103: Tell inventory control.
- 104: Tell that the demo is over and print a message about how to take a screenshot.

6	Arrow hit player
- Note: Sent when any player is struck by an arrow.

7	Rain level change
- Note: Seems to change both sky color and lighting.
- Rain level ranging from 0 to 1.

8	Thunder level change
- Note: Seems to change both sky color and lighting (same as Rain level change, but doesn't start rain). It also requires rain to render by vanilla client.
- Thunder level ranging from 0 to 1.

9	Play pufferfish sting sound

10	Play elder guardian mob appearance (effect and sound)	

11	Enable respawn screen
- 0: Enable respawn screen.
- 1: Immediately respawn (sent when the doImmediateRespawn gamerule changes).

12	Limited crafting
- 0: Disable limited crafting.
- 1: Enable limited crafting (sent when the doLimitedCrafting gamerule changes).

13	Start waiting for level chunks
- Instructs the client to begin the waiting process for the level chunks.
- Sent by the server after the level is cleared on the client and is being re-sent (either during the first, or subsequent reconfigurations).
*/