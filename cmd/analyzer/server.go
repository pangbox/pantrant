package main

import (
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"log"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/pangbox/pantrant/pcap"
	"github.com/pangbox/pantrant/web"
)

type msgtype struct {
	Kind   pcap.ServerKind
	Origin pcap.MessageOrigin
	ID     uint16
}

type message struct {
	Time   float64
	Data   []byte
	Origin pcap.MessageOrigin
}

type stream struct {
	Kind      pcap.ServerKind
	CryptoKey byte
	HelloMsg  message
	Messages  []message
}

type cassette struct {
	Name         string
	Time         time.Time
	Streams      []stream
	Messages     map[uint32][]message
	MessageTypes map[uint32]msgtype
	VideoURL     string

	videoFn string
}

type cassetteParams struct {
	Name string

	PcapFilename  string
	VideoFilename string

	TimeReference time.Time
	TimePosition  float64
}

func pmsgToMsg(videoStartTime time.Time, pmsg pcap.Message) message {
	return message{
		Time:   float64(pmsg.Time.Sub(videoStartTime)/time.Millisecond) / 1000.0,
		Data:   pmsg.Data,
		Origin: pmsg.Origin,
	}
}

func packType(mtype msgtype) uint32 {
	packed := uint32(mtype.ID)
	switch mtype.Kind {
	case pcap.LoginServer:
		packed |= 0x01000000
	case pcap.GameServer:
		packed |= 0x02000000
	case pcap.MessageServer:
		packed |= 0x03000000
	}
	switch mtype.Origin {
	case pcap.ClientMessage:
		packed |= 0x00010000
	case pcap.ServerMessage:
		packed |= 0x00020000
	}
	return packed
}

func newCassette(params cassetteParams) (*cassette, error) {
	videoStartTime := params.TimeReference.Add(time.Duration(-params.TimePosition*1000) * time.Millisecond)

	log.Printf("Extracting pcap streams...")
	pstreams, err := pcap.ExtractStreamsFromFile(params.PcapFilename)

	if err != nil {
		return nil, err
	}

	c := &cassette{
		Name:         params.Name,
		Time:         videoStartTime,
		Streams:      []stream{},
		Messages:     make(map[uint32][]message),
		MessageTypes: make(map[uint32]msgtype),
		VideoURL:     "/video.mp4",
		videoFn:      params.VideoFilename,
	}

	for i, pstream := range pstreams {
		log.Printf("Reconstructed stream %d: %s [key=%01x]", i, pstream.Kind, pstream.CryptoKey)
		s := stream{}
		s.Kind = pstream.Kind
		s.CryptoKey = pstream.CryptoKey
		s.HelloMsg = pmsgToMsg(videoStartTime, pstream.HelloMsg)
		for _, msg := range pstream.Messages {
			s.Messages = append(s.Messages, pmsgToMsg(videoStartTime, msg))
		}
		for _, msg := range pstream.Messages {
			if len(msg.Data) < 2 {
				log.Printf("Warning: message too small to contain ID?!")
				continue
			}
			id := binary.LittleEndian.Uint16(msg.Data)
			mtype := msgtype{s.Kind, msg.Origin, id}
			pid := packType(mtype)
			c.Messages[pid] = append(c.Messages[pid], pmsgToMsg(videoStartTime, msg))
			c.MessageTypes[pid] = mtype
		}
		c.Streams = append(c.Streams, s)
	}

	log.Printf("Processing complete; %d streams, %d distinct message types", len(pstreams), len(c.Messages))

	return c, nil
}

func runServer(listen string, cassettes []*cassette) error {
	assets := http.FileServer(http.FS(web.App))
	vidmap := map[string]string{}

	for _, c := range cassettes {
		namesum := sha256.Sum256([]byte(c.videoFn))
		namehash := hex.EncodeToString(namesum[:])[:8]
		vidmap[namehash] = c.videoFn
		c.VideoURL = "/video.mp4?" + namehash
	}

	ln, err := net.Listen("tcp", listen)
	if err != nil {
		log.Printf("Hint: change listen address with -listen.")
		return err
	}

	host, port, err := net.SplitHostPort(ln.Addr().String())
	if err != nil {
		return err
	}

	if host == "::" || host == "0.0.0.0" {
		host = "localhost"
	}

	listenUrl := url.URL{Scheme: "http", Host: net.JoinHostPort(host, port)}
	log.Printf("Listening at %s", listenUrl.String())

	return http.Serve(ln, http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/video.mp4":
			vidfilename, ok := vidmap[r.URL.RawQuery]
			if !ok {
				log.Println("unknown video hash", r.URL.RawQuery)
				rw.WriteHeader(404)
				return
			}
			rw.Header().Set("Content-Type", "video/mp4")
			http.ServeFile(rw, r, vidfilename)
			return

		case "/cassettes.json":
			rw.Header().Set("Content-Type", "text/json")
			if err := json.NewEncoder(rw).Encode(cassettes); err != nil {
				log.Printf("Error encoding output JSON: %v", err)
			}
			return

		default:
			// Golang can be a bit flaky here, so override the content types.
			if strings.HasSuffix(r.URL.Path, ".js") {
				rw.Header().Set("Content-Type", "text/javascript")
			} else if strings.HasSuffix(r.URL.Path, ".css") {
				rw.Header().Set("Content-Type", "text/css")
			} else if strings.HasSuffix(r.URL.Path, ".woff") {
				rw.Header().Set("Content-Type", "font/woff")
			} else if strings.HasSuffix(r.URL.Path, ".ttf") {
				rw.Header().Set("Content-Type", "font/tff")
			} else if strings.HasSuffix(r.URL.Path, ".eot") {
				rw.Header().Set("Content-Type", "font/eot")
			}
			r.URL.Path = "/gen" + r.URL.Path
			assets.ServeHTTP(rw, r)
		}
	}))
}
