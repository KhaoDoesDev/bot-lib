import { ClientboundCustomPayload, ClientboundFinishConfiguration, ClientboundRegistryData, ClientboundSelectKnownPacks, ClientboundUpdateEnabledFeatures, ClientboundUpdateTags, ServerboundClientInformation, ServerboundFinishConfiguration, ServerboundSelectKnownPacks } from "./config";
import { ServerboundIntention } from "./handshake";
import { ClientboundLoginCompression, ClientboundLoginDisconnect, ClientboundLoginFinished, ServerboundHello, ServerboundLoginAcknowledged } from "./login";
import { ClientboundChangeDifficulty, ClientboundEntityEvent, ClientboundEntityPositionSync, ClientboundGameEvent, ClientboundInitializeBorder, ClientboundKeepAlive, ClientboundLogin, ClientboundMoveEntityPos, ClientboundMoveEntityPosRot, ClientboundPlayerAbilities, ClientboundPlayerPosition, ClientboundRecipeBookSettings, ClientboundRotateHead, ClientboundServerData, ClientboundSetChunkCacheRadius, ClientboundSetDefaultSpawnPosition, ClientboundSetEntityMotion, ClientboundSetExperience, ClientboundSetHeldItem, ClientboundSetSimulationDistance, ClientboundSetSpawn, ClientboundSound, ClientboundSystemChat, ClientboundTickingState, ClientboundTickingStep, ClientboundUpdateRecipes, ServerboundKeepAlive } from "./play";

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
  ClientboundSetSimulationDistance,
  ClientboundMoveEntityPosRot,
  ClientboundRotateHead,
  ClientboundMoveEntityPos,
  ClientboundSetEntityMotion,
  ClientboundEntityPositionSync,
  ClientboundSystemChat,
  ClientboundInitializeBorder,
  ClientboundSetDefaultSpawnPosition,
  ClientboundGameEvent,
  ClientboundTickingState,
  ClientboundTickingStep
];

export const packets = [...serverboundPackets, ...clientboundPackets];

export * from "./handshake";
export * from "./login";
export * from "./config";
export * from "./play";