#!/bin/sh
set -eu
cd /website
# Keep read-only content outside Compose Watch's writable source tree.
if [ -d /content ]; then
  rm -rf src/content
  ln -s /content src/content
fi
if [ -d /iiif-config ]; then
  rm -rf iiif-config
  ln -s /iiif-config iiif-config
fi
if [ "${LOCAL_WAIT_FOR_IIIF_CACHE:-0}" = 1 ]; then
  attempts=0
  until [ -f .iiif/.foundry-ready ]; do
    attempts=$((attempts + 1))
    if [ "$attempts" -gt 300 ]; then
      echo 'Mock publisher did not prepare the IIIF cache within five minutes.' >&2
      exit 1
    fi
    sleep 1
  done
fi
exec "$@"
