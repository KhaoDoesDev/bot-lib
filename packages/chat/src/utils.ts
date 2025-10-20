import { stringify, type TagObject } from "nbt-ts";

export function processNbtMessage(msg: TagObject | null): string | null {
  if (!msg || msg.type === "end") return null;
  return JSON.stringify(stringify(msg), (key, val) =>
    key === "id" && Array.isArray(val)
      ? Buffer.from(new Int32Array(val).buffer).toString("hex")
      : val
  );
}

export const escapeHtml = (unsafe: string): string =>
  unsafe.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        c
      ]!)
  );

export const escapeRGB = (hex: string): string =>
  `color:rgb(${hex
    .match(/.{2}/g)
    ?.map((c) => parseInt(c, 16))
    .join(",")})`;