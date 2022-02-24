# Pantrant
Pantrant (**Pa**ngya **N**etwork **Tr**affic **An**alysis **T**ool) is a tool for analyzing network traffic dumps of Pangya sessions and view them alongside recordings.

## Prerequisites
Pantrant requires Go 1.16 or higher and recommends Node 16.

### Installing Go
If your package manager (homebrew, apt, etc.) has Go 1.16 or higher, you can install it using your package manager.

If not, you should install Go via the [install guide](https://go.dev/doc/install). Unlike most software, using the pre-built version of Go is robust even on Linux.

Remember to uninstall Go from your package manager if you are installing the pre-built version.

### Installing Node.JS
If your package manager (homebrew, apt, etc.) has Node.JS 16 or higher, you can install it using your package manager. Make sure you install npm in addition to Node.JS.

## Getting Started
You don't need to build the webapp unless you want to modify it. The build is versioned in the repository. If you just want to run the Analyzer Server, skip the web app section.

### Building the Web App
To build the web app, you need to install the Node.JS dependencies.

```sh
cd web
npm install
```

Now you can run the build:

```sh
npm run build
```

### Building the Pantrant Analyzer Server
You can run the analyzer directly with `go run`:

```
go run ./cmd/analyzer /path/to/cassettes.yml
```

You can also build the analyzer using `go build`:

```
go build ./cmd/analyzer
./analyzer /path/to/cassettes.yml
```

### Building the Pantrant Dumper
You can run the dumper directly with `go run`:

```
go run ./cmd/dumper /path/to/dump.pcapng
```

You can also build the dumper using `go build`:

```
go build ./cmd/dumper
./dumper /path/to/dump.pcapng
```
