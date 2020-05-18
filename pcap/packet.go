package pcap

import (
	"compress/gzip"
	"errors"
	"io"
	"os"
	"strings"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcapgo"
	"github.com/google/gopacket/tcpassembly"
)

// ExtractStreamsFromFile opens a pcap file from disk and reads it into streams.
func ExtractStreamsFromFile(filename string) ([]*Stream, error) {
	cap, err := openPcapFile(filename)
	if err != nil {
		return nil, err
	}

	return ExtractStreams(cap)
}

func openPcapFile(filename string) (gopacket.PacketDataSource, error) {
	var cap gopacket.PacketDataSource
	var r io.Reader

	r, err := os.Open(filename)
	if err != nil {
		return nil, err
	}

	// Wrap in Gzip reader if necessary.
	// (Pcapng reader doesn't do this automatically, pcap reader does.)
	if strings.HasSuffix(filename, ".gz") {
		r, err = gzip.NewReader(r)
		if err != nil {
			return nil, err
		}
		filename = filename[:len(filename)-3]
	}

	// Call appropriate packet loader.
	if strings.HasSuffix(filename, ".pcap") {
		cap, err = pcapgo.NewReader(r)
		if err != nil {
			return nil, err
		}
	} else if strings.HasSuffix(filename, ".pcapng") {
		cap, err = pcapgo.NewNgReader(r, pcapgo.NgReaderOptions{WantMixedLinkType: true})
		if err != nil {
			return nil, err
		}
	} else {
		return nil, errors.New("no handler for file " + filename)
	}

	return cap, nil
}

// ExtractStreams extracts streams out of a packet dump.
func ExtractStreams(source gopacket.PacketDataSource) ([]*Stream, error) {
	streamFactory := newTCPStreamFactory()
	streamPool := tcpassembly.NewStreamPool(streamFactory)
	assembler := tcpassembly.NewAssembler(streamPool)

	for {
		data, in, err := source.ReadPacketData()
		if err == io.EOF {
			break
		} else if err != nil {
			return nil, err
		}

		packet := gopacket.NewPacket(data, layers.LayerTypeEthernet, gopacket.Default)
		if packet.NetworkLayer() == nil {
			packet = gopacket.NewPacket(data, layers.LayerTypeLoopback, gopacket.Default)
		}
		if packet.NetworkLayer() == nil || packet.TransportLayer() == nil || packet.TransportLayer().LayerType() != layers.LayerTypeTCP {
			continue
		}

		tcp := packet.TransportLayer().(*layers.TCP)
		assembler.AssembleWithTimestamp(packet.NetworkLayer().NetworkFlow(), tcp, in.Timestamp)
	}

	return streamFactory.streams, nil
}
