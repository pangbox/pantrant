import * as React from "react";
import { Tab, Tabs, Button, MenuItem } from "@blueprintjs/core";
import { Select, ItemRenderer } from "@blueprintjs/select";

import { MainView as PacketViewer } from "./packetviewer/MainView";
import { MainView as MessageAnalyzer } from "./messageanalyzer/MainView";
import { AppData, AppDataContext } from "./AppData";
import { Cassette } from "../cassette";

interface Props {
  appData: AppData;
}

export const renderCassette: ItemRenderer<Cassette> = (
  cassette,
  { handleClick, modifiers }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={cassette.Name + cassette.Time + cassette.VideoUrl}
      onClick={handleClick}
      text={cassette.Name}
    />
  );
};

export const App = (props: Props) => {
  const [appData, setAppData] = React.useState(props.appData);

  return (
    <AppDataContext.Provider value={appData}>
      <Tabs id="app-tabs" defaultSelectedTabId="packet" className="bp3-dark">
        <Tab id="packet" title="Packet Viewer" panel={<PacketViewer />} />
        <Tab
          id="message"
          title="Message Analyzer"
          panel={<MessageAnalyzer />}
        />
        <Tabs.Expander />
        <Select<Cassette>
          items={appData.cassettes}
          itemRenderer={renderCassette}
          onItemSelect={cassette => {
            setAppData(Object.assign({}, appData, { currentCassette: cassette }))
          }}
          filterable={false}
        >
          <Button
            text={appData.currentCassette.Name}
            rightIcon="double-caret-vertical"
            small={true}
            minimal={true}
          />
        </Select>
      </Tabs>
    </AppDataContext.Provider>
  );
};
