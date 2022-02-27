import { Classes, Icon, Intent, Tree, TreeNodeInfo } from '@blueprintjs/core';
import { Classes as Popover2Classes, ContextMenu2, Tooltip2 } from "@blueprintjs/popover2";
import * as React from 'react';
import { Message, MessageType } from '../../cassette';
import { getPacketName } from '../../packetdef';
import { AppDataContext } from '../AppData';

interface Props {
  messageTypes: MessageType[];
  messages: Map<MessageType, Message[]>;
}

interface State {
  expanded: Set<string|number>;
}

type NodePath = number[];

export const PacketTree = (props: Props) => {
  const [state, setState] = React.useState<State>({
    expanded: new Set,
  })

  const handleNodeClick = React.useCallback(
    (node: TreeNodeInfo, nodePath: NodePath, e: React.MouseEvent<HTMLElement>) => {
      const originallySelected = node.isSelected;
      if (!e.shiftKey) {
        //dispatch({ type: "DESELECT_ALL" });
      }
      //dispatch({
      //    payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
      //    type: "SET_IS_SELECTED",
      //});
    },
    [],
  );

  const handleNodeCollapse = React.useCallback((node: TreeNodeInfo) => {
    const expanded = new Set(state.expanded);
    expanded.delete(node.id);
    console.log([...expanded], [...state.expanded]);
    setState({...state, expanded});
  }, [state]);

  const handleNodeExpand = React.useCallback((node: TreeNodeInfo) => {
    const expanded = new Set(state.expanded);
    expanded.add(node.id);
    console.log([...expanded], [...state.expanded]);
    setState({...state, expanded});
  }, [state]);

  let tree: TreeNodeInfo[] = [];
  let kindNodes: Map<string, {
    parent: TreeNodeInfo;
    originNodes: Map<string, {
      parent: TreeNodeInfo;
    }>;
  }> = new Map();

  for (const msgType of props.messageTypes) {
    let kindNode = kindNodes.get(msgType.Kind);
    if (!kindNode) {
      const id = `${msgType.Kind}`;
      const node: TreeNodeInfo = {
        id,
        icon: "application",
        isExpanded: state.expanded.has(id),
        label: (
          <ContextMenu2 {...contentSizing} content={<div>placeholder</div>}>
            <Tooltip2 content="placeholder" placement="right">
              {msgType.Kind}
            </Tooltip2>
          </ContextMenu2>
        ),
        childNodes: [],
      }
      kindNode = {
        parent: node,
        originNodes: new Map()
      }
      kindNodes.set(msgType.Kind, kindNode);
      tree.push(node);
    }
    let originNode = kindNode.originNodes.get(msgType.Origin);
    if (!originNode) {
      const id = `${msgType.Kind}-${msgType.Origin}`;
      const node: TreeNodeInfo = {
        id,
        icon: msgType.Origin === "client" ? "import" : "export",
        isExpanded: state.expanded.has(id),
        label: (
          <ContextMenu2 {...contentSizing} content={<div>placeholder</div>}>
            <Tooltip2 content="placeholder" placement="right">
              {msgType.Origin === "client" ? "Client" : "Server"}
            </Tooltip2>
          </ContextMenu2>
        ),
        childNodes: [],
      }
      originNode = {
        parent: node
      }
      kindNode.originNodes.set(msgType.Origin, originNode);
      kindNode.parent.childNodes = [...kindNode.parent.childNodes ?? [], node];
    }
    const name = getPacketName(msgType.Kind, msgType.Origin, msgType.ID);
    const id = `${msgType.Kind}-${msgType.Origin}-${msgType.ID}`;
    const node: TreeNodeInfo = {
      id,
      icon: "document",
      label: name
    };
    originNode.parent.childNodes = [...originNode.parent.childNodes ?? [], node]
  }

  return (
    <AppDataContext.Consumer>
      {appData => appData?.currentCassette ? (
        <Tree
          contents={tree}
          onNodeClick={handleNodeClick}
          onNodeCollapse={handleNodeCollapse}
          onNodeExpand={handleNodeExpand}
          className={Classes.ELEVATION_0}
        />
      ) : null}
    </AppDataContext.Consumer>
  );
};

const contentSizing = { popoverProps: { popoverClassName: Popover2Classes.POPOVER2_CONTENT_SIZING } };
