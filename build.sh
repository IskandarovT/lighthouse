#!/usr/bin/env bash
set -e

# Install the same Zola version you use locally
ZOLA_VERSION=0.19.2

curl -L https://github.com/getzola/zola/releases/download/v$ZOLA_VERSION/zola-v$ZOLA_VERSION-x86_64-unknown-linux-gnu.tar.gz \
  | tar -xz -C /usr/local/bin

zola build
