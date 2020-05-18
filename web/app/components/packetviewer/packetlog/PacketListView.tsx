import * as React from "react";
import { Event, ServerKind } from "../../../cassette";
import { Packet } from "./Packet";

interface Props {
  timeOffset: number;
  timeWindow: number;
  currentTime: number;
  visibleKinds: ReadonlyArray<ServerKind>;
  events: Event[];
}

function timeCriteria(
  currentTime: number,
  timeWindow: number,
  timeOffset: number
) {
  return (e: Event) => {
    return currentTime >= e.Time && currentTime <= e.Time + timeWindow;
  };
}

function serverKindCriteria(
    visibleKinds: ReadonlyArray<ServerKind>
) {
  return (e: Event) => {
    return visibleKinds.indexOf(e.ServerKind) !== -1;
  }
}

export const PacketListView: React.SFC<Props> = ({
  timeOffset,
  timeWindow,
  currentTime,
  visibleKinds,
  events
}: Props) => {
  return (
    <React.Fragment>
      {events
        .filter(timeCriteria(currentTime, timeWindow, timeOffset))
        .filter(serverKindCriteria(visibleKinds))
        .map(event => (
          <Packet event={event} key={event.ID} />
        ))}
    </React.Fragment>
  );
};
