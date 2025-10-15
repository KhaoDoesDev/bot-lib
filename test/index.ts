import { connect, Socket } from "net";
import { readVarInt, writeShort, writeString, writeUUID, writeVarInt } from "./datatypes";

const HOST = "localhost";
const PORT = 25565;
const USERNAME = "testbot";
const UUID = "daebc46b-4c7d-342f-ba57-b07fc7084e29";
const PROTOCOL_VERSION = 772; // 1.21.8
let state = 0;
let loginSuccess = false;
let compressionThreshold = 0;

const client = new Socket();

client.connect(PORT, HOST, () => {
  console.log("Connected to server");

  client.write(
    createPacket(
      0x00,
      Buffer.concat([
        writeVarInt(PROTOCOL_VERSION),
        writeString(HOST),
        writeShort(PORT),
        writeVarInt(2),
      ])
    )
  );
  console.log("Sent handshake");
  client.write(
    createPacket(
      0x00,
      Buffer.concat([writeString(USERNAME), writeUUID(UUID)])
    )
  );
  console.log("Sent login start");
});

let buffer = Buffer.alloc(0);
import zlib from "zlib";

client.on("data", (data) => {
  buffer = Buffer.concat([buffer, data]);

  while (buffer.length > 0) {
    try {
      const { value: packetLength, length: packetLengthSize } = readVarInt(buffer);
      if (buffer.length < packetLength + packetLengthSize) break;

      const packetData = buffer.slice(packetLengthSize, packetLength + packetLengthSize);
      buffer = buffer.slice(packetLength + packetLengthSize);

      let uncompressed;
      if (compressionThreshold > 0) {
        // Step 2: read Data Length varint
        const { value: dataLength, length: dataLengthSize } = readVarInt(packetData);
        const remaining = packetData.slice(dataLengthSize);

        if (dataLength === 0) {
          uncompressed = remaining;
        } else {
          uncompressed = zlib.inflateSync(remaining);
        }
      } else {
        uncompressed = packetData;
      }

      const { value: packetId, length: packetIdSize } = readVarInt(uncompressed);
      const packet = uncompressed.slice(packetIdSize);

      console.log(`Received packet ID: 0x${packetId.toString(16)}`);

      switch (packetId) {
        case 0x02:
          console.log("Login successful");
          break;
        case 0x03:
          compressionThreshold = readVarInt(packet).value;
          console.log(`Compression threshold set to ${compressionThreshold}`);
          break;
        case 0x40:
          console.log("Disconnected:", packet.toString("utf8"));
          client.destroy();
          return;
        default:
          console.log(`Unhandled packet ID: 0x${packetId.toString(16)}`);
      }
    } catch (err) {
      console.error("Error parsing packet:", err);
      buffer = buffer.slice(1);
    }
  }
});

client.on("end", () => {
  console.log("Disconnected from server");
});

function createPacket(packetId: number, data: Buffer) {
  const packetIdBuffer = writeVarInt(packetId);
  const lengthBuffer = writeVarInt(packetIdBuffer.length + data.length);
  return Buffer.concat([lengthBuffer, packetIdBuffer, data]);
}
