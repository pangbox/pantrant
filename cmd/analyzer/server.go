package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"time"

	assetfs "github.com/elazarl/go-bindata-assetfs"
	"github.com/pangbox/pantrant/internal/bindata"
	"github.com/pangbox/pantrant/pcap"
)

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
	Name     string
	Time     time.Time
	Streams  []stream
	VideoURL string

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

func newCassette(params cassetteParams) (*cassette, error) {
	videoStartTime := params.TimeReference.Add(time.Duration(-params.TimePosition*1000) * time.Millisecond)

	pstreams, err := pcap.ExtractStreamsFromFile(params.PcapFilename)

	if err != nil {
		return nil, err
	}

	c := &cassette{
		Name:     params.Name,
		Time:     videoStartTime,
		Streams:  []stream{},
		VideoURL: "/video.mp4",
		videoFn:  params.VideoFilename,
	}

	for _, pstream := range pstreams {
		s := stream{}
		s.Kind = pstream.Kind
		s.CryptoKey = pstream.CryptoKey
		s.HelloMsg = pmsgToMsg(videoStartTime, pstream.HelloMsg)
		for _, msg := range pstream.Messages {
			s.Messages = append(s.Messages, pmsgToMsg(videoStartTime, msg))
		}
		c.Streams = append(c.Streams, s)
	}

	return c, nil
}

func runServer(listen string, cassettes []*cassette) error {
	assets := http.FileServer(&assetfs.AssetFS{Asset: bindata.Asset, AssetDir: bindata.AssetDir, AssetInfo: bindata.AssetInfo, Prefix: ""})
	vidmap := map[string]string{}

	for _, c := range cassettes {
		namesum := sha256.Sum256([]byte(c.videoFn))
		namehash := hex.EncodeToString(namesum[:])[:8]
		vidmap[namehash] = c.videoFn
		c.VideoURL = "/video.mp4?" + namehash
	}

	return http.ListenAndServe(listen, http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
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
			assets.ServeHTTP(rw, r)
		}
	}))
}
