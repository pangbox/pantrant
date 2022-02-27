import { Card } from '@blueprintjs/core';
import * as React from 'react';
import { Message, MessageType, Event } from '../../cassette';
import { AppDataContext } from '../AppData';
import { PacketListView } from './PacketListView';
import { CurrentMessageType } from './PacketTypeSelector';

function messagesToEvents(msgtype: MessageType, messages: Message[]): Event[] {
  return messages.map((message, i) => ({
    ID: msgtype.ID,
    Type: "Message",
    Time: message.Time,
    Message: message,
    ServerKind: msgtype.Kind,
  }));
}

export const PacketList = () => {
  return (
    <CurrentMessageType.Consumer>
      {currentMessageType => 
        <AppDataContext.Consumer>
          {appData => appData?.currentCassette ? (
            <Card style={{ flexGrow: 1, overflowY: "scroll", marginTop: "6px" }}>
              <PacketListView
                events={
                  currentMessageType !== null ?
                  messagesToEvents(
                    currentMessageType,
                    appData.currentCassette.Messages.get(currentMessageType) ?? []
                  ) : [] } />
            </Card>
          ) : null}
        </AppDataContext.Consumer>
      }
    </CurrentMessageType.Consumer>
  );
};
