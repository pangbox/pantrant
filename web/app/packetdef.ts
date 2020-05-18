import { ServerKind, MessageOrigin } from "./cassette";

interface PacketDef {
  Kind: ServerKind;
  Origin: MessageOrigin;
  From: string;
  Defs: { [id: string]: string };
}

const packetDefs: PacketDef[] = [
  {
    Kind: "LoginServer",
    Origin: "client",
    From: "hsreina/pangya-server",
    Defs: {
      "0001": "PLAYER_LOGIN",
      "0003": "PLAYER_SELECT_SERVER",
      "0006": "PLAYER_SET_NICKNAME",
      "0007": "PLAYER_CONFIRM",
      "0008": "PLAYER_SELECT_CHARCTER",
      "000B": "PLAYER_RECONNECT"
    }
  },
  {
    Kind: "LoginServer",
    Origin: "server",
    From: "hsreina/pangya-server",
    Defs: {
      "0001": "LOGIN",
      "0002": "SERVERS_LIST",
      "0003": "PLAYER_SECURITY2",
      "0006": "PLAYER_MACROS",
      "0009": "UN_0009",
      "0010": "PLAYER_SECURITY1",
      "0040": "GG_CHECK",
      "004D": "LOBBIES_LIST"
    }
  },
  {
    Kind: "GameServer",
    Origin: "client",
    From: "hsreina/pangya-server",
    Defs: {
      "0002": "PLAYER_LOGIN",
      "0003": "PLAYER_MESSAGE",
      "0004": "PLAYER_JOIN_LOBBY",
      "0007": "PLAYER_REQUEST_OFFLINE_PLAYER_INFO",
      "0008": "PLAYER_CREATE_GAME",
      "0009": "PLAYER_JOIN_GAME",
      "000A": "PLAYER_CHANGE_GAME_SETTINGS",
      "000B": "PLAYER_CHANGE_EQUPMENT_A",
      "000C": "PLAYER_CHANGE_EQUPMENT_B",
      "000D": "PLAYER_READY",
      "000E": "PLAYER_START_GAME",
      "000F": "PLAYER_LEAVE_GAME",
      "0011": "PLAYER_LOAD_OK",
      "0012": "PLAYER_ACTION_SHOT",
      "0013": "PLAYER_ACTION_ROTATE",
      "0014": "PLAYER_ACTION_HIT",
      "0015": "PLAYER_POWER_SHOT",
      "0016": "PLAYER_ACTION_CHANGE_CLUB",
      "0017": "PLAYER_USE_ITEM",
      "0019": "PLAYER_MOVE_AZTEC",
      "001A": "PLAYER_HOLE_INFORMATIONS",
      "001B": "PLAYER_SHOTDATA",
      "001C": "PLAYER_SHOT_SYNC",
      "001D": "PLAYER_BUY_ITEM",
      "0020": "PLAYER_CHANGE_EQUIP",
      "0026": "MASTER_KICK_PLAYER",
      "002A": "PLAYER_WHISPER",
      "002F": "PLAYER_REQUEST_INFO",
      "0030": "PLAYER_PAUSE_GAME",
      "0031": "PLAYER_HOLE_COMPLETE",
      "0033": "PLAYER_EXCEPTION",
      "0034": "PLAYER_1ST_SHOT_READY",
      "003E": "ADMIN_JOIN_GAME",
      "003D": "PLAYER_REQUEST_COOKIES_COUNT",
      "0041": "PLAYER_REQUEST_IDENTITY",
      "0043": "PLAYER_REQUEST_SERVERS_LIST",
      "0048": "PLAYER_LOADING_INFO",
      "004B": "PLAYER_UPGRADE",
      "0057": "PLAYER_NOTICE",
      "005C": "PLAYER_REQUEST_SERVER_TIME",
      "0063": "PLAYER_ACTION",
      "0064": "PLAYER_DELETE_ITEM",
      "0065": "PLAYER_FAST_FORWARD",
      "0071": "PLAYER_ENTER_SCRATCHY_SERIAL",
      "0073": "PLAYER_SET_MASCOT_TEXT",
      "0075": "PLAYER_CLOSE_SHOP",
      "0076": "PLAYER_EDIT_SHOP",
      "0077": "PLAYER_ENTER_SHOP",
      "0079": "PLAYER_EDIT_SHOP_NAME",
      "007A": "PLAYER_REQUEST_SHOP_VISITORS_COUNT",
      "007B": "PLAYER_REQUEST_INCOME",
      "007C": "PLAYER_EDIT_SHOP_ITEMS",
      "007D": "PLAYER_BUY_SHOP_ITEM",
      "0081": "PLAYER_JOIN_MULTIPLAYER_GAME_LIST",
      "0082": "PLAYER_LEAVE_MULTIPLAYER_GAME_LIST",
      "008B": "PLAYER_REQUEST_MESSENGER_LIST",
      "008F": "PLAYER_GM_COMMAND",
      "0098": "PLAYER_OPEN_RARE_SHOP",
      "00AE": "PLAYER_CLEAR_QUEST",
      "00BA": "PLAYER_SEND_INVITE",
      "00CC": "PLAYER_REQUEST_LOCKER_ACCESS",
      "00CD": "PLAYER_REQUEST_LOCKER_PAGE",
      "00D1": "PLAYER_CHANGE_LOCKER_PASSWORD",
      "00D3": "PLAYER_REQUEST_LOCKER",
      "00D4": "PLAYER_LOCKER_PANGS_TRANSACTION",
      "00D5": "PLAYER_REQUEST_LOCKER_PANGS",
      "00EB": "PLAYER_UN_00EB",
      "0101": "PLAYER_GUILD_CREATE",
      "0102": "PLAYER_GUILD_CHECK_NAME",
      "0108": "PLAYER_GUILD_LIST",
      "0109": "PLAYER_GUILD_LIST_SEARCH",
      "010C": "PLAYER_GUILD_REQUEST_JOIN",
      "012A": "PLAYER_OPEN_SCRATCHY_CARD",
      "0140": "PLAYER_UN_0140",
      "0143": "PLAYER_REQUEST_INBOX",
      "0144": "PLAYER_REQUEST_INBOX_DETAILS",
      "0145": "PLAYER_SEND_MAIL",
      "0146": "PLAYER_MOVE_INBOX_GIFT",
      "0147": "PLAYER_DELETE_MAIL",
      "014B": "PLAYER_PLAY_BONGDARI_SHOP",
      "0151": "PLAYER_REQUEST_DAILY_QUEST",
      "0152": "PLAYER_ACCEPT_DAILY_QUEST",
      "0154": "PLAYER_GIVEUP_DAILY_QUEST",
      "0157": "PLAYER_REQUEST_ACHIEVEMENTS",
      "016E": "PLAYER_REQUEST_DAILY_REWARD",
      "0176": "PLAYER_ENTER_GRAND_PRIX",
      "0177": "PLAYER_LEAVE_GRAND_PRIX",
      "0179": "ENTER_GRAND_PRIX_EVENT",
      "017A": "LEAVE_GRAND_PRIX_EVENT",
      "0184": "PLAYER_SET_ASSIST_MODE",
      "0188": "PLAYER_CHAR_MASTERY",
      "018D": "PLAYER_RECYCLE_ITEM"
    }
  },
  {
    Kind: "GameServer",
    Origin: "server",
    From: "hsreina/pangya-server",
    Defs: {
      "0044": "PLAYER_MAIN_DATA",
      "0052": "GAME_PLAY_INFO",
      "0055": "PLAYER_ACTION_SHOT",
      "0056": "PLAYER_ACTION_ROTATE",
      "0059": "PLAYER_ACTION_CHANGE_CLUB",
      "0063": "PLAYER_NEXT",
      "0070": "PLAYER_CHARACTERS_DATA",
      "0071": "PLAYER_CADDIES_DATA",
      "0072": "PLAYER_EQUIP_DATA",
      "0073": "PLAYER_ITEMS_DATA",
      "0090": "PLAYER_1ST_SHOT_READY",
      "0096": "PLAYER_COOKIES",
      "00A3": "PLAYER_LOADING_INFO",
      "00E1": "PLAYER_MASCOTS_DATA"
    }
  }
];

function toHex(i: number, pad: number) {
  return ("0".repeat(pad) + i.toString(0x10)).substr(-pad);
}

export function getPacketName(kind: ServerKind, origin: MessageOrigin, packetId: number): string|null {
  const key = toHex(packetId, 4).toUpperCase();

  for (const {Kind,Origin,Defs} of packetDefs) {
    if (Kind !== kind || origin != Origin) {
      continue;
    }

    if (Defs[key]) {
      return Defs[key];
    }
  }

  return null;
}
