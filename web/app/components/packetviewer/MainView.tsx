import * as React from "react";
import { Mosaic, MosaicWindow } from "react-mosaic-component";

import { PacketLog } from "./packetlog/PacketLog";
import { VideoView } from "./VideoView";
import { AppDataContext } from "../AppData";

export type WindowId = "video" | "packet";

interface WindowType {
  title: string;
  component: React.FunctionComponent;
}

const WINDOW_MAP: Record<WindowId, WindowType> = {
  packet: {
    title: "Packet Log",
    component: () => <PacketLog />
  },
  video: {
    title: "Video",
    component: () => (
      <AppDataContext.Consumer>
        {appData => appData?.currentCassette ? (
          <VideoView src={appData.currentCassette.VideoUrl} key={appData.currentCassette.VideoUrl} />
        ) : null}
      </AppDataContext.Consumer>
    )
  },
};

export const MainView = () => {
  return (
    <Mosaic<WindowId>
      renderTile={(id, path) => {
        const Component = WINDOW_MAP[id].component;
        return (
          <MosaicWindow<WindowId> path={path} title={WINDOW_MAP[id].title}>
            <Component />
          </MosaicWindow>
        );
      }}
      initialValue={{
        direction: "row",
        first: "packet",
        second: "video",
        splitPercentage: 40
      }}
      resize={{
        minimumPaneSizePercentage: 5
      }}
      className="mosaic-blueprint-theme bp3-dark"
    />
  );
};
