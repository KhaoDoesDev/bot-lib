import { ClientboundCustomPayload, ClientboundFinishConfiguration, ClientboundRegistryData, ClientboundSelectKnownPacks, ClientboundUpdateEnabledFeatures, ClientboundUpdateTags, ServerboundClientInformation, ServerboundFinishConfiguration, ServerboundSelectKnownPacks } from "./config";
import { ServerboundIntention } from "./handshake";
import { ClientboundLoginCompression, ClientboundLoginFinished, ServerboundHello, ServerboundLoginAcknowledged } from "./login";

export const serverboundPackets = [
  ServerboundIntention,
  ServerboundHello,
  ServerboundLoginAcknowledged,
  ServerboundClientInformation,
  ServerboundSelectKnownPacks,
  ServerboundFinishConfiguration
];

export const clientboundPackets = [
  ClientboundLoginCompression,
  ClientboundLoginFinished,
  ClientboundUpdateEnabledFeatures,
  ClientboundSelectKnownPacks,
  ClientboundRegistryData,
  ClientboundFinishConfiguration,
  ClientboundCustomPayload,
  ClientboundUpdateTags
];

export const packets = [...serverboundPackets, ...clientboundPackets];

export * from "./handshake";
export * from "./login";
export * from "./config";