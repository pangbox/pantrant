package main

import (
	"flag"
	"log"
	"os"
	"path/filepath"

	yaml "gopkg.in/yaml.v2"
)

func init() {
	flag.Parse()
}

func main() {
	if flag.NArg() != 1 {
		flag.Usage()
		os.Exit(0)
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

	cmfile, err := os.Open(cmfilepath)
	if err != nil {
		log.Fatalln(err)
	}
	defer cmfile.Close()

	err = yaml.NewDecoder(cmfile).Decode(&cmetas)
	if err != nil {
		log.Fatalln(err)
	}

	cassettes := []*cassette{}

	for _, cmeta := range cmetas {
		cassette, err := newCassette(cmeta)
		if err != nil {
			log.Fatalln(err)
		}
		cassettes = append(cassettes, cassette)
	}

	log.Fatalln(runServer(":8080", cassettes))
}
