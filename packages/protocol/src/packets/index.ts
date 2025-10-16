import { ClientboundSelectKnownPacks, ClientboundUpdateEnabledFeatures, ServerboundClientInformation } from "./config";
import { ServerboundIntention } from "./handshake";
import { ClientboundLoginCompression, ClientboundLoginFinished, ServerboundHello, ServerboundLoginAcknowledged } from "./login";

export const serverboundPackets = [
  ServerboundIntention,
  ServerboundHello,
  ServerboundLoginAcknowledged,
  ServerboundClientInformation,
];

export const clientboundPackets = [
  ClientboundLoginCompression,
  ClientboundLoginFinished,
  ClientboundUpdateEnabledFeatures,
  ClientboundSelectKnownPacks
];

export const packets = [...serverboundPackets, ...clientboundPackets];

export * from "./handshake";
export * from "./login";
export * from "./config";