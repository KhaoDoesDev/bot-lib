import { Socket } from "net";
import { Connection } from "./connection";
import { ServerboundIntention } from "./packets";

const HOST = "localhost";
const PORT = 25565;

// const socket = new Socket();
// const conn = new Connection(socket);

// conn.setCompressionThreshold(256);

// socket.connect(PORT, HOST, async () => {
//   console.log(`Connected to ${HOST}:${PORT}`);

//   const handshake = new ServerboundIntention(
//     772,
//     HOST,
//     PORT,
//     2
//   );

//   await conn.writePacket(handshake.serialize());
//   console.log("Handshake sent!");

//   const hello = new ServerboundHello(
//     "testbot",
//     "00000000-0000-0000-0000-000000000000"
//   );
//   await conn.writePacket(hello.serialize());
//   console.log("Login Hello sent!");

//   socket.end();
// });

const packet = new ServerboundIntention(772, "localhost", 25565, 2);
console.log(packet);

const packetBuf = packet.serialize();
console.log(packetBuf);

const newPacket = ServerboundIntention.deserialize(packetBuf);
console.log(newPacket);