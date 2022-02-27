import { Classes, Icon, Intent, Tree, TreeNodeInfo } from '@blueprintjs/core';
import { Classes as Popover2Classes, ContextMenu2, Tooltip2 } from "@blueprintjs/popover2";
import * as React from 'react';
import { AppDataContext } from '../AppData';
import { PacketTree } from './PacketTree';

export const MainView = () => {
    return (
      <AppDataContext.Consumer>
        {appData => appData?.currentCassette ? (
          <PacketTree
            messages={appData.currentCassette.Messages}
            messageTypes={appData.currentCassette.MessageTypes} />
        ) : null}
      </AppDataContext.Consumer>
    );
};
