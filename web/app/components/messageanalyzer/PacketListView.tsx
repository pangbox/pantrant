import React from "react";
import { Event } from "../../cassette";
import { Packet } from "../packetviewer/packetlog/Packet";

interface Props {
  events: Event[];
}

export const PacketListView = (props: Props) => {
  return (
    <React.Fragment>
      {props.events.map(event => (
        <Packet event={event} key={event.ID} />
      ))}
    </React.Fragment>
  );
}