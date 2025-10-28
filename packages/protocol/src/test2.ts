import { encode } from "nbt-ts";
import { ClientboundRegistryData } from "./packets";
const packet = new ClientboundRegistryData("example:registry", [{
  id: "example:registry2",
  data: encode("name", { a: "a" })
}]);
console.log("Original Packet:", packet);

const serialized = await packet.serialize();
console.log("Serialized Buffer:", serialized);

ClientboundRegistryData.deserialize(serialized).then((deserializedPacket) => {
  console.log("Deserialized Packet:", deserializedPacket);
});