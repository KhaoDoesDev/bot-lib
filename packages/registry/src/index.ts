import minecraftData, { type IndexedData } from "minecraft-data";

export default function registry(version: string): IndexedData {
  const data = minecraftData(version);
  if (!data) throw new Error(`Minecraft data for version "${version}" not found`);
  return data;
}