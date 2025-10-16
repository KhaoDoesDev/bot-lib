export class GameProfile {
  constructor(public uuid: string, public username: string, public properties: Map<string, GameProfilePropertyValue>) { 
  }
}

export type GameProfilePropertyValue = {
  value: string;
  signature?: string;
}