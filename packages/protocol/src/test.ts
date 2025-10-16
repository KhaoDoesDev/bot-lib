import { Client } from "./client";
import { ClientboundCustomPayload, ClientboundFinishConfiguration, ClientboundLoginCompression, ClientboundLoginFinished, ClientboundSelectKnownPacks, ClientboundUpdateEnabledFeatures, ServerboundClientInformation, ServerboundFinishConfiguration, ServerboundHello, ServerboundIntention, ServerboundLoginAcknowledged, ServerboundSelectKnownPacks } from "./packets";
import { States } from "./types";

const HOST = "localhost";
const PORT = 25565;

const client = new Client(HOST, PORT);

// client.setCompressionThreshold(256);

client.socket.on("connect", async () => {
  console.log(`Connected to ${HOST}:${PORT}`);

  const handshake = new ServerboundIntention(
    772,
    HOST,
    PORT,
    2
  );

  await client.writePacket(handshake);
  console.log("Handshake sent!");

  const hello = new ServerboundHello(
    "testbot",
    "00000000-0000-0000-0000-000000000000"
  );
  await client.writePacket(hello);
  console.log("Login Hello sent!");

  client.state = States.LOGIN;
});

client.on("packet", async (packet) => {
  console.log(packet);
  if (packet instanceof ClientboundLoginFinished) {
    console.log("Login successful!");
    await client.writePacket(new ServerboundLoginAcknowledged());
    client.state = States.CONFIG;

    await client.writePacket(
      new ServerboundClientInformation(
        "en_US",
        10,
        0,
        true,
        {
          cape: true,
          jacket: true,
          leftSleeve: true,
          rightSleeve: true,
          leftPants: true,
          rightPants: true,
          hat: true,
        },
        0,
        true,
        true,
        0
      )
    );
  } else if (packet instanceof ClientboundLoginCompression) {
    client.compressionThreshold = packet.threshold; 
    console.log(`Compression threshold set to ${packet.threshold}`);
  } else if (packet instanceof ClientboundSelectKnownPacks) {
    client.writePacket(new ServerboundSelectKnownPacks([]));
  } else if (packet instanceof ClientboundFinishConfiguration) {
    client.writePacket(new ServerboundFinishConfiguration());
    client.state = States.PLAY;
    console.log("Reached Play State");
  }
});

client.on("unhandledPacket", (id, payload) => {
  console.log(`Unhandled packet ID: 0x${id.toString(16)}`);
  console.log(payload);
});