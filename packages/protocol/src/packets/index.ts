import { ClientboundCustomPayload, ClientboundFinishConfiguration, ClientboundRegistryData, ClientboundSelectKnownPacks, ClientboundUpdateEnabledFeatures, ClientboundUpdateTags, ServerboundClientInformation, ServerboundFinishConfiguration, ServerboundSelectKnownPacks } from "./config";
import { ServerboundIntention } from "./handshake";
import { ClientboundLoginCompression, ClientboundLoginDisconnect, ClientboundLoginFinished, ServerboundHello, ServerboundLoginAcknowledged } from "./login";
import { ClientboundChangeDifficulty, ClientboundEntityEvent, ClientboundKeepAlive, ClientboundLogin, ClientboundPlayerAbilities, ClientboundPlayerPosition, ClientboundRecipeBookSettings, ClientboundServerData, ClientboundSetChunkCacheRadius, ClientboundSetExperience, ClientboundSetHeldItem, ClientboundSetSimulationDistance, ClientboundSetSpawn, ClientboundSound, ClientboundUpdateRecipes, ServerboundKeepAlive } from "./play";

export const serverboundPackets = [
  ServerboundIntention,
  ServerboundHello,
  ServerboundLoginAcknowledged,
  ServerboundClientInformation,
  ServerboundSelectKnownPacks,
  ServerboundFinishConfiguration,
  ServerboundKeepAlive
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
  ClientboundChangeDifficulty,
  ClientboundPlayerAbilities,
  ClientboundSetHeldItem,
  ClientboundUpdateRecipes,
  ClientboundEntityEvent,
  ClientboundRecipeBookSettings,
  ClientboundPlayerPosition,
  ClientboundServerData,
  ClientboundSetSpawn,
  ClientboundSetExperience,
  ClientboundKeepAlive,
  ClientboundSound,
  ClientboundSetChunkCacheRadius,
  ClientboundSetSimulationDistance
];

export const packets = [...serverboundPackets, ...clientboundPackets];

export * from "./handshake";
export * from "./login";
export * from "./config";
export * from "./play";