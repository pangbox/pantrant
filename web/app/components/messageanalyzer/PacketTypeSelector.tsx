import { Card } from '@blueprintjs/core';
import * as React from 'react';
import { MessageType } from '../../cassette';
import { AppDataContext } from '../AppData';
import { PacketTypeTree } from './PacketTypeTree';

interface Props {
  setCurrentMessageType: (type: MessageType|null) => void;
}

export const CurrentMessageType = React.createContext<MessageType|null>(null);

export const PacketTypeSelector = (props: Props) => {
  return (
    <AppDataContext.Consumer>
      {appData => appData?.currentCassette ? (
        <Card style={{ flexGrow: 1, overflowY: "scroll", marginTop: "6px" }}>
          <PacketTypeTree
            messages={appData.currentCassette.Messages}
            messageTypes={appData.currentCassette.MessageTypes}
            setCurrentMessageType={props.setCurrentMessageType} />
        </Card>
      ) : null}
    </AppDataContext.Consumer>
  );
};
