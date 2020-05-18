import * as React from "react";
import {
  Button,
  Collapse,
  Card,
  Popover,
  Menu,
  Position,
  MenuItem
} from "@blueprintjs/core";

import { Settings } from "./Settings";
import { VideoConsumer } from "../VideoControl";
import { AppDataContext } from "../../AppData";
import { PacketListView } from "./PacketListView";
import { SERVER_KINDS, ServerKind } from "../../../cassette";

export const PacketLog = () => {
  const [open, setOpen] = React.useState(false);
  const [timeWindow, setTimeWindow] = React.useState(10.0);
  const [timeOffset, setTimeOffset] = React.useState(0.0);
  const [visibleKinds, setVisibleKinds] = React.useState(
    Object.freeze<ServerKind>([...SERVER_KINDS])
  );

  return (
    <React.Fragment>
      <div>
        <div style={{ display: "flex" }}>
          <Popover
            content={
              <Menu>
                {SERVER_KINDS.map(kind => 
                  <MenuItem
                    text={kind}
                    onClick={() => {
                      if (visibleKinds.indexOf(kind) !== -1) {
                        setVisibleKinds(visibleKinds.filter(n => n !== kind));
                      } else {
                        setVisibleKinds(
                          Object.freeze<ServerKind>([...visibleKinds, kind])
                        );
                      }
                    }}
                    icon={
                      visibleKinds.indexOf(kind) !== -1 ? "eye-open" : "eye-off"
                    }
                    key={kind}
                  />
                )}
              </Menu>
            }
            position={Position.BOTTOM_LEFT}
          >
            <Button minimal={true} small={true} icon="filter">
              Filter
            </Button>
          </Popover>
          <div style={{ flexGrow: 1 }} />
          <Button
            onClick={() => setOpen(!open)}
            icon="cog"
            minimal={true}
            small={true}
          >
            {open ? "Hide" : "Show"} Settings
          </Button>
        </div>
        <Collapse isOpen={open}>
          <Card style={{ marginTop: "6px" }}>
            <Settings
              timeWindow={timeWindow}
              setTimeWindow={setTimeWindow}
              timeOffset={timeOffset}
              setTimeOffset={setTimeOffset}
            />
          </Card>
        </Collapse>
      </div>
      <Card style={{ flexGrow: 1, overflowY: "scroll", marginTop: "6px" }}>
        <AppDataContext.Consumer>
          {appData => (
            <VideoConsumer>
              {(VideoControl, currentTime) =>
                appData ? (
                  <PacketListView
                    timeWindow={timeWindow}
                    timeOffset={timeOffset}
                    currentTime={currentTime}
                    visibleKinds={visibleKinds}
                    events={appData.currentCassette.Events}
                  />
                ) : null
              }
            </VideoConsumer>
          )}
        </AppDataContext.Consumer>
      </Card>
    </React.Fragment>
  );
};
