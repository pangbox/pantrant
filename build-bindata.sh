#!/bin/sh
set -e

# Clean web portion
rm -rf web/.cache web/dist

# Build web portion
( cd web && npm && npm run build )

# Package to Go
go-bindata-assetfs -o internal/bindata/bindata.go -pkg bindata -prefix web/dist web/dist