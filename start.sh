#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

PORT=8080
URL="http://localhost:${PORT}/novel-reader.html"

echo "Starting Novel Reader on port ${PORT}..."

# Open browser after a short delay
(sleep 1 && (xdg-open "$URL" 2>/dev/null || open "$URL" 2>/dev/null || start "" "$URL")) &

# Serve in foreground (Ctrl+C to stop)
python3 -m http.server "$PORT" 2>/dev/null || python -m http.server "$PORT"
