import * as React from 'react';
import { PacketList } from './PacketList';
import { CurrentMessageType, PacketTypeSelector } from './PacketTypeSelector';

import { Mosaic, MosaicNode, MosaicWindow, TileRenderer } from "react-mosaic-component";
import { MessageType } from '../../cassette';

export type WindowId = "types" | "list";

export const MainView = () => {
  const [currentMessageType, setCurrentMessageType] = React.useState<MessageType|null>(null);
  const [currentNode, setCurrentNode] = React.useState<MosaicNode<WindowId>|null>({
    direction: "row",
    first: "types",
    second: "list",
    splitPercentage: 40
  });
  const renderTile: TileRenderer<WindowId> = React.useCallback((id, path) => {
    switch(id) {
    case "types":
      return (
        <MosaicWindow<WindowId> path={path} title={"Packet Types"}>
          <PacketTypeSelector setCurrentMessageType={setCurrentMessageType} />
        </MosaicWindow>
      );
    case "list":
      return (
        <MosaicWindow<WindowId> path={path} title={"Packet List"}>
          <PacketList />
        </MosaicWindow>
      );
    }
  }, []);
  
  return (
    <CurrentMessageType.Provider value={currentMessageType}>
      <Mosaic<WindowId>
        renderTile={renderTile}
        value={currentNode}
        onChange={setCurrentNode}
        resize={{minimumPaneSizePercentage: 5}}
        className="mosaic-blueprint-theme bp3-dark"
      />
    </CurrentMessageType.Provider>
  );
};
