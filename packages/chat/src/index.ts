import {
  parse,
  stringify,
  type Tag,
  type TagObject,
} from "nbt-ts";
import { DEFAULT_ANSI_CODES } from "./constants";

const MAX_CHAT_DEPTH = 8;
const MAX_CHAT_LENGTH = 4096;

type ChatComponent =
  | string
  | number
  | ChatMessage
  | Array<ChatMessage>
  | Record<string, any>;

interface ChatClick_event {
  action: "open_url" | "open_file" | "run_command" | "suggest_command";
  value: string;
}

interface ChatHover_event {
  action: "show_text" | "show_achievement" | "show_item" | "show_entity";
  value: Tag | null;
}

interface ChatJson {
  text?: string | number;
  translate?: string;
  fallback?: string;
  with?: ChatJson[];
  extra?: ChatJson[];

  color?: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;

  click_event?: ChatClick_event;
  hover_event?: ChatHover_event;
}

function simpleFormat(fmt: string, args: any[]): string {
  let i = 0;
  return fmt.replace(/%(?:(\d+)\$)?(s|%)/g, (_, pos, type) => {
    if (type === "%") return "%";
    const idx = pos ? parseInt(pos, 10) - 1 : i++;
    return args[idx] !== undefined ? String(args[idx]) : "";
  });
}

export default class ChatMessage {
  json: ChatJson;
  text?: string | number;
  translate?: string;
  fallback?: string;
  with?: ChatMessage[];
  extra?: ChatMessage[];

  color?: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;

  click_event?: ChatClick_event;
  hover_event?: ChatHover_event;

  constructor(message: ChatComponent) {
    if (message instanceof ChatMessage) {
      this.json = { ...message.json };
    } else if (typeof message === "string" || typeof message === "number") {
      this.json = { text: message };
    } else if (Array.isArray(message)) {
      this.json = {
        extra: message.map((m) => (m instanceof ChatMessage ? m.json : m)),
      };
    } else {
      this.json = message;
    }
    this.parse();
  }

  private parse(depth = 0) {
    if (depth > MAX_CHAT_DEPTH) return;

    this.text = this.json.text;
    this.translate = this.json.translate;
    this.fallback = this.json.fallback;
    this.color = this.json.color;
    this.bold = !!this.json.bold;
    this.italic = !!this.json.italic;
    this.underlined = !!this.json.underlined;
    this.strikethrough = !!this.json.strikethrough;
    this.obfuscated = !!this.json.obfuscated;
    this.click_event = this.json.click_event;
    this.hover_event = this.json.hover_event;

    if (Array.isArray(this.json.with))
      this.with = this.json.with.map((c) => new ChatMessage(c));
    if (Array.isArray(this.json.extra))
      this.extra = this.json.extra.map((c) => new ChatMessage(c));

    if (this.hover_event?.action === "show_item") {
      try {
        const v = Array.isArray(this.hover_event.value)
          ? this.hover_event.value[0]
          : this.hover_event.value;
        this.hover_event.value = parse(
          typeof v === "string" ? v : JSON.stringify(v)
        );
      } catch {
        this.hover_event.value = null;
      }
    }
  }

  toString(depth = 0): string {
    if (depth > MAX_CHAT_DEPTH) return "";

    let result = "";

    if (this.text !== undefined) {
      result += this.text;
    } else if (this.translate) {
      const args = this.with?.map((w) => w.toString(depth + 1)) ?? [];
      const fmt = this.fallback ?? this.translate;
      result += simpleFormat(fmt, args);
    }

    if (this.extra)
      result += this.extra.map((e) => e.toString(depth + 1)).join("");
    return result.replace(/§[0-9a-flnmokr]/g, "").slice(0, MAX_CHAT_LENGTH);
  }

  toAnsi(): string {
    let msg = this.toString();

    for (const code in DEFAULT_ANSI_CODES)
      msg = msg.replace(new RegExp(code, "g"), DEFAULT_ANSI_CODES[code]!);

    const hexRegex = /§#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/gi;
    msg = msg.replace(
      hexRegex,
      (_, r, g, b) =>
        `\u001b[38;2;${parseInt(r, 16)};${parseInt(g, 16)};${parseInt(b, 16)}m`
    );

    return DEFAULT_ANSI_CODES["§r"] + msg + DEFAULT_ANSI_CODES["§r"];
  }

  static fromNbt(msg: TagObject | null) {
    if (!msg || msg.type === "end") return new ChatMessage("");
    const jsonStr = JSON.stringify(stringify(msg));
    return new ChatMessage(jsonStr);
  }
}

export * from "./utils";