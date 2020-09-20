#!/bin/sh

youtube-dl \
  --format "(bestaudio[acodec=opus]/bestaudio)/best" \
  --force-ipv4 \
  --sleep-interval 5 \
  --max-sleep-interval 30 \
  --ignore-errors \
  --no-continue \
  --no-overwrites \
  --add-metadata \
  --extract-audio \
  --output "./public/%(title)s.%(ext)s" \
  --merge-output-format "mkv" \
  --batch-file "source-audio"
