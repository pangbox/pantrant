package pcap

import (
	"encoding/binary"
	"fmt"
	"log"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/tcpassembly"
)

// Map of known PangYa server ports.
var pangyaPorts = map[uint16]ServerKind{
	10101: LoginServer,
	10201: LoginServer,
	10103: LoginServer,
	10303: LoginServer,
	20201: GameServer,
	20202: GameServer,
	20203: GameServer,
	20207: GameServer,
	10102: MessageServer,
	30303: MessageServer,
}

type pangTCPStreamFactory struct {
	streammap map[gopacket.Flow]*Stream
	streams   []*Stream
}

type pointInTimeError struct {
	Time time.Time
	Err  error
}

func (e pointInTimeError) Unwrap() error { return e.Err }

func (e pointInTimeError) Error() string { return fmt.Sprintf("%s: %s", e.Time, e.Err) }

type pangTCPStream struct {
	net, transport gopacket.Flow
	direction      MessageOrigin
	stream         *Stream
}

func (h *pangTCPStream) Reassembled(reassembly []tcpassembly.Reassembly) {
	for _, part := range reassembly {
		switch h.direction {
		case ServerMessage:
			errs := h.stream.consumeServerPacket(part.Seen, part.Bytes)
			h.stream.Errors = append(h.stream.Errors, errs...)
		case ClientMessage:
			errs := h.stream.consumeClientPacket(part.Seen, part.Bytes)
			h.stream.Errors = append(h.stream.Errors, errs...)
		}
	}
}

func (h *pangTCPStream) ReassemblyComplete() {}

type nilStream struct{}

func (nilStream) Reassembled(reassembly []tcpassembly.Reassembly) {}
func (nilStream) ReassemblyComplete()                             {}

func newTCPStreamFactory() *pangTCPStreamFactory {
	return &pangTCPStreamFactory{
		streammap: map[gopacket.Flow]*Stream{},
	}
}

func (h *pangTCPStreamFactory) New(net, transport gopacket.Flow) tcpassembly.Stream {
	var stream *Stream
	var direction MessageOrigin

	srcport := binary.BigEndian.Uint16(transport.Src().Raw())
	dstport := binary.BigEndian.Uint16(transport.Dst().Raw())

	if kind, ok := pangyaPorts[dstport]; ok {
		stream = newPangStream(kind)
		h.streammap[transport] = stream
		h.streams = append(h.streams, stream)
		direction = ClientMessage
	} else if _, ok := pangyaPorts[srcport]; ok {
		stream, ok = h.streammap[transport.Reverse()]
		if !ok {
			log.Printf("unexpected server-before-client stream: %s %s", net, transport)
			return nilStream{}
		}
		direction = ServerMessage
	} else {
		return nilStream{}
	}

	return &pangTCPStream{
		net:       net,
		transport: transport,
		direction: direction,
		stream:    stream,
	}
}
