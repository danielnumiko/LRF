#!/usr/bin/env python3
"""Static server for the prototype, with caching off.

python -m http.server sends Last-Modified and the browser will happily reuse a
stale stylesheet after an edit, which is very easy to mistake for the change
not working. This sends no-store instead.

    python3 serve.py [port]
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    handler = partial(NoCacheHandler, directory=str(Path(__file__).parent))
    print(f"Serving the prototype on http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
