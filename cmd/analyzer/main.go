package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"os"
	"path/filepath"
	"strings"

	yaml "gopkg.in/yaml.v2"
)

func main() {
	listen := flag.String("listen", ":8080", "address to listen on")
	flag.Parse()
	if flag.NArg() != 1 {
		fmt.Fprintf(os.Stderr, "No cassettes.yml file provided.\nUsage: analyzer <cassettes.yml>\n\n")
		flag.Usage()
		os.Exit(0)
	}
	_, _, err := net.SplitHostPort(*listen)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Invalid listen address: %v\n\n", err)
		if !strings.ContainsRune(*listen, ':') {
			fmt.Fprintf(os.Stderr, "Hint: you can omit the hostname in -listen, but not the :\n")
			fmt.Fprintf(os.Stderr, "Try formatting it like: -listen :8080\n\n")
		}
		flag.Usage()
		os.Exit(1)
	}

	cmetas := []cassetteParams{}

	cmfilepath, err := filepath.Abs(flag.Arg(0))
	if err != nil {
		log.Fatalln(err)
	}

	cmfiledir := filepath.Dir(cmfilepath)
	err = os.Chdir(cmfiledir)
	if err != nil {
		log.Fatalln(err)
	}

	log.Printf("Opening cassettes file at %q.", cmfilepath)
	cmfile, err := os.Open(cmfilepath)
	if err != nil {
		log.Fatalln(err)
	}
	defer cmfile.Close()

	log.Printf("Decoding cassette metadata.")
	err = yaml.NewDecoder(cmfile).Decode(&cmetas)
	if err != nil {
		log.Fatalln(err)
	}

	cassettes := []*cassette{}

	log.Printf("Processing cassette data, please hold.")
	for _, cmeta := range cmetas {
		log.Printf("Processing %q (packet capture file %q)...", cmeta.Name, cmeta.PcapFilename)
		cassette, err := newCassette(cmeta)
		if err != nil {
			log.Fatalln(err)
		}
		cassettes = append(cassettes, cassette)
	}

	log.Printf("All done. Starting server on %q.", *listen)
	log.Fatalln(runServer(*listen, cassettes))
}
