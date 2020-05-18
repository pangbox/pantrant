import { decodeBase64 } from "./base64";

export type ServerKind = "LoginServer" | "GameServer" | "MessageServer";
export type MessageOrigin = "client" | "server";

export const SERVER_KINDS = Object.freeze<ServerKind>(["LoginServer", "GameServer", "MessageServer"]);

export namespace Schema {
  export interface Message {
    Time: number;
    Data: string;
    Origin: MessageOrigin;
  }

  export interface Stream {
    Kind: ServerKind;
    CryptoKey: number;
    HelloMsg: Message;
    Messages: Message[];
  }

  export interface Cassette {
    Name: string;
    Time: string;
    Streams: Stream[];
    VideoURL: string;
  }
}

export class Message {
  Time: number;
  Data: ArrayBuffer;
  Origin: MessageOrigin;

  constructor(data: Schema.Message) {
    this.Time = data.Time;
    this.Data = decodeBase64(data.Data);
    this.Origin = data.Origin;
  }
}

export class Stream {
  Kind: ServerKind;
  CryptoKey: number;
  HelloMsg: Message;
  Messages: Message[];

  constructor(data: Schema.Stream) {
    this.Kind = data.Kind;
    this.CryptoKey = data.CryptoKey;
    this.HelloMsg = new Message(data.HelloMsg);
    this.Messages = data.Messages.map(n => new Message(n));
  }
}

export type Event = {
  ID: number;
  Type: "Connect" | "Message";
  Time: number;
  ServerKind: ServerKind;
  Message: Message;
};

export class Cassette {
  Name: string;
  Time: Date;
  Streams: Stream[];
  Events: Event[];
  VideoUrl: string;

  constructor(data: Schema.Cassette) {
    this.Name = data.Name;
    this.Time = new Date(data.Time);
    this.Streams = data.Streams.map(n => new Stream(n));
    this.VideoUrl = data.VideoURL;

    this.Events = [];
    let i = 0;
    this.Streams.forEach(stream => {
      this.Events.push({
        ID: i++,
        Type: "Connect",
        Time: stream.HelloMsg.Time,
        Message: stream.HelloMsg,
        ServerKind: stream.Kind,
      });
      stream.Messages.forEach(message => {
        this.Events.push({
          ID: i++,
          Type: "Message",
          Time: message.Time,
          Message: message,
          ServerKind: stream.Kind,
        });
      });
    });

    this.Events.sort((b, a) =>
      a.Time < b.Time ? -1 : a.Time > b.Time ? 1 : 0
    );
  }
}
