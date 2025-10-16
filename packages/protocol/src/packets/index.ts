import { ClientboundCustomPayload, ClientboundFinishConfiguration, ClientboundRegistryData, ClientboundSelectKnownPacks, ClientboundUpdateEnabledFeatures, ClientboundUpdateTags, ServerboundClientInformation, ServerboundFinishConfiguration, ServerboundSelectKnownPacks } from "./config";
import { ServerboundIntention } from "./handshake";
import { ClientboundLoginCompression, ClientboundLoginDisconnect, ClientboundLoginFinished, ServerboundHello, ServerboundLoginAcknowledged } from "./login";
import { ClientboundChangeDifficulty, ClientboundLogin } from "./play";

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
  ClientboundLoginDisconnect,
  ClientboundUpdateEnabledFeatures,
  ClientboundSelectKnownPacks,
  ClientboundRegistryData,
  ClientboundFinishConfiguration,
  ClientboundCustomPayload,
  ClientboundUpdateTags,
  ClientboundLogin,
  ClientboundChangeDifficulty
];

export const packets = [...serverboundPackets, ...clientboundPackets];

export * from "./handshake";
export * from "./login";
export * from "./config";
export * from "./play";