import * as React from "react";
import { Card, ButtonGroup, Button } from "@blueprintjs/core";
import { Event } from "../../../cassette";
import { VideoConsumer } from "../VideoControl";
import { HexView } from "./HexView";
import { getPacketName } from "../../../packetdef";

interface Props {
  event: Event;
}

function packetName(event: Event): string|null {
  switch (event.Type) {
  case "Connect":
    return "Hello";
  case "Message":
    if (event.Message.Data.byteLength < 2) {
      return null;
    }

    const data = new Uint16Array(event.Message.Data.slice(0, 2));
    return getPacketName(event.ServerKind, event.Message.Origin, data[0]);
  }
}

export const Packet = ({ event }: Props) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const name = React.useMemo(() => packetName(event), []);

  const classes = [
    "message-card",
    "kind-" + event.ServerKind.toLowerCase(),
    "origin-" + event.Message.Origin,
  ];

  if (collapsed) {
    classes.push("message-collapsed");
  }

  const direction =
    event.Message.Origin === "client" ? (
      <>Client &rarr; {event.ServerKind}</>
    ) : (
      <>&larr; {event.ServerKind}</>
    );

  const controls = 
    <VideoConsumer>
      {videoControl =>
        <ButtonGroup>
          <Button minimal={true} small={true} icon="cross" onClick={() => setCollapsed(true)}>Close</Button>
          <Button minimal={true} small={true} icon="link" onClick={() => videoControl.currentTime = event.Time}>Seek to</Button>
        </ButtonGroup>
      }
    </VideoConsumer>;

  return (
    <Card interactive={collapsed} className={classes.join(" ")} onClick={() => collapsed ? setCollapsed(false) : null}>
      {collapsed ? null : <div>{controls}<hr/></div>}
      <div><small>{direction} &bull; {name}</small></div>
      <HexView data={event.Message.Data} collapsed={collapsed}></HexView>
    </Card>
  );
};
