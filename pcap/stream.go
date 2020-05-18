package pcap

import (
	"encoding/binary"
	"time"

	"github.com/pangbox/pangcrypt"
)

func newPangStream(kind ServerKind) *Stream {
	return &Stream{
		Kind:      kind,
		CryptoKey: 0xFF,
	}
}

func (s *Stream) consumeHelloPacket(time time.Time, data []byte) {
	s.HelloMsg.Data = data
	s.HelloMsg.Time = time
	s.HelloMsg.Origin = ServerMessage

	switch s.Kind {
	case LoginServer:
		s.CryptoKey = data[6]
	case GameServer:
		s.CryptoKey = data[8]
	case MessageServer:
		s.CryptoKey = data[8]
	default:
		panic("unknown server kind")
	}
}

func (s *Stream) consumeServerPacket(time time.Time, data []byte) []pointInTimeError {
	if len(data) == 0 {
		return nil
	}

	// Special case for hello packet.
	if s.CryptoKey == 0xFF {
		s.consumeHelloPacket(time, data)
		return nil
	}

	s.serverBuf = append(s.serverBuf, data...)

	var errors []pointInTimeError

	for len(s.serverBuf) > 4 {
		var msgData []byte

		msgLen := int(binary.LittleEndian.Uint16(s.serverBuf[1:3])) + 3

		// Buffer exhausted.
		if msgLen > len(s.serverBuf) {
			break
		}

		msgData, s.serverBuf = s.serverBuf[:msgLen], s.serverBuf[msgLen:]

		msgData, err := pangcrypt.ServerDecrypt(msgData, s.CryptoKey)
		if err != nil {
			errors = append(errors, pointInTimeError{time, err})
		}

		msg := Message{
			Time:   time,
			Data:   msgData,
			Origin: ServerMessage,
		}
		s.Messages = append(s.Messages, msg)
	}

	return errors
}

func (s *Stream) consumeClientPacket(time time.Time, data []byte) []pointInTimeError {
	s.clientBuf = append(s.clientBuf, data...)

	var errors []pointInTimeError

	for len(s.clientBuf) > 4 {
		var msgData []byte

		msgLen := int(binary.LittleEndian.Uint16(s.clientBuf[1:3])) + 4

		// Buffer exhausted.
		if msgLen > len(s.clientBuf) {
			break
		}

		msgData, s.clientBuf = s.clientBuf[:msgLen], s.clientBuf[msgLen:]

		msgData, err := pangcrypt.ClientDecrypt(msgData, s.CryptoKey)
		if err != nil {
			errors = append(errors, pointInTimeError{time, err})
		}

		msg := Message{
			Time:   time,
			Data:   msgData,
			Origin: ClientMessage,
		}
		s.Messages = append(s.Messages, msg)
	}

	return errors
}
