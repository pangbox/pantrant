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

  export interface MessageType {
    Kind: ServerKind;
    Origin: MessageOrigin;
    ID: number;
  }

  export interface Cassette {
    Name: string;
    Time: string;
    Streams: Stream[];
    Messages: {[id: string]: Message[]};
    MessageTypes: {[id: string]: MessageType};
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

export class MessageType {
  Kind: ServerKind;
  Origin: MessageOrigin;
  ID: number;

  constructor(data: Schema.MessageType) {
    this.Kind = data.Kind;
    this.Origin = data.Origin;
    this.ID = data.ID;
  }
}

export class Cassette {
  Name: string;
  Time: Date;
  Streams: Stream[];
  Messages: Map<MessageType, Message[]>;
  MessageTypes: MessageType[];
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
      a.Time < b.Time ? -1 : a.Time > b.Time ? 1 : a.ID < b.ID ? -1 : a.ID > b.ID ? 1 : 0
    );

    this.MessageTypes = [];
    this.Messages = new Map();

    const MessageTypeMapping = new Map<number, MessageType>();
    for (const [k, v] of Object.entries(data.MessageTypes)) {
      const t = new MessageType(v);
      MessageTypeMapping.set(Number(k), t);
      this.MessageTypes.push(t);
    }

    for (const [k, v] of Object.entries(data.Messages)) {
      const t = MessageTypeMapping.get(Number(k));
      if (!t) {
        throw new Error("Analyzer gave us message with undefined type.")
      }
      this.Messages.set(t, v.map(n => new Message(n)));
    }

    this.MessageTypes.sort((a, b) => (
      a.Kind < b.Kind ? -1 :
      a.Kind > b.Kind ? 1 :
      a.Origin < b.Origin ? -1 :
      a.Origin > b.Origin ? 1 :
      a.ID < b.ID ? -1 :
      b.ID > a.ID ? 1 : 0
    ));
  }
}
