package main

import (
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/pangbox/pantrant/pcap"
)

var (
	outDir = ""
)

const (
	stamp = "060102.1504"
)

func init() {
	flag.StringVar(&outDir, "out", "", "output directory")
	flag.Parse()
}

func main() {
	for _, arg := range flag.Args() {
		filepath.Walk(arg, func(path string, f os.FileInfo, err error) error {
			if f.IsDir() || !strings.Contains(path, ".pcap") {
				return nil
			}

			streams, err := pcap.ExtractStreamsFromFile(path)
			if err != nil {
				log.Printf("error processing %s: %s\n", path, err)
			}

			filehash := sha256.New()
			for _, stream := range streams {
				for _, message := range stream.Messages {
					filehash.Write(message.Data)
				}
				for _, err := range stream.Errors {
					log.Printf("err: %s", err)
				}
			}
			filesum := hex.EncodeToString(filehash.Sum(nil))[:4]

			for j, stream := range streams {
				streamhash := sha256.New()
				for _, message := range stream.Messages {
					streamhash.Write(message.Data)
				}
				streamsum := hex.EncodeToString(streamhash.Sum(nil))[:4]
				for i, message := range stream.Messages {
					msgid := binary.LittleEndian.Uint16(message.Data[:2])
					hash := sha256.Sum256(message.Data)
					msgsum := hex.EncodeToString(hash[:])[:4]
					msgkind := strings.ToLower(string(stream.Kind))
					timestr := message.Time.Format(stamp)
					groupby := fmt.Sprintf("%s-%s", msgkind, message.Origin)
					msgfile := fmt.Sprintf("%04x-%s-%s.%04x.%s.%04x-%s.bin", msgid, timestr, filesum, j, streamsum, i, msgsum[:4])
					err := os.MkdirAll(filepath.Join(outDir, groupby), 0755)
					if err != nil {
						log.Fatalln(err)
					}
					outpath := filepath.Join(outDir, groupby, msgfile)
					err = ioutil.WriteFile(outpath, message.Data, 0644)
					if err != nil {
						log.Fatalln(err)
					}
				}
			}

			return nil
		})
	}
}
