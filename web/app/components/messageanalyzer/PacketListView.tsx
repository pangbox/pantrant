import React from "react";
import { Event } from "../../cassette";
import { Packet } from "../packetviewer/packetlog/Packet";

interface Props {
  events: Event[];
}

export const PacketListView = (props: Props) => {
  return (
    <React.Fragment>
      {props.events.map((event, i) => (
        <Packet event={event} key={`${event.ServerKind}:${event.Message.Origin}:${event.ID}:${i}`} />
      ))}
    </React.Fragment>
  );
}