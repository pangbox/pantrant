package pcap

import "time"

// ServerKind specifies the type of PangYa server the packet came from.
type ServerKind string

// These are the known PangYa server kinds.
const (
	LoginServer   ServerKind = "LoginServer"
	GameServer    ServerKind = "GameServer"
	MessageServer ServerKind = "MessageServer"
)

// MessageOrigin specifies whether the packet came from the server or client.
type MessageOrigin string

const (
	// ClientMessage is the origin of a packet sent by the PangYa client.
	ClientMessage MessageOrigin = "client"

	// ServerMessage is the origin of a packet sent by the PangYa server.
	ServerMessage MessageOrigin = "server"
)

// Message represents a decrypted PangYa message.
type Message struct {
	Time   time.Time
	Data   []byte
	Origin MessageOrigin
}

// Stream represents a single decrypted session with a PangYa server.
type Stream struct {
	Kind ServerKind

	CryptoKey byte
	HelloMsg  Message
	Messages  []Message
	Errors    []error

	clientBuf []byte
	serverBuf []byte
}
