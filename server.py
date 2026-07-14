import http.server
import socketserver
import json
import os
import sys

PORT = 9000
DIRECTORY = os.path.dirname(os.path.abspath(__file__)) if os.path.dirname(__file__) else "."
CONFIG_FILE = os.path.join(DIRECTORY, "config.json")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == "/api/save-key":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                api_key = data.get("apiKey")
                
                # Load config
                config = {}
                if os.path.exists(CONFIG_FILE):
                    try:
                        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                            config = json.load(f)
                    except:
                        pass
                
                config["apiKey"] = api_key
                with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                    json.dump(config, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            super().do_POST()

    def do_GET(self):
        if self.path == "/api/get-key":
            api_key = None
            if os.path.exists(CONFIG_FILE):
                try:
                    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                        config = json.load(f)
                        api_key = config.get("apiKey")
                except:
                    pass
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"apiKey": api_key}).encode('utf-8'))
        else:
            super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# Set working directory to project root
os.chdir(DIRECTORY)

# Prevent port sharing issues by configuring allow_reuse_address
socketserver.TCPServer.allow_reuse_address = True

print(f"Starting server on port {PORT} in {DIRECTORY}...")
try:
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Serving Veerber at http://localhost:{PORT}")
        print(f"Press Ctrl+C to terminate.")
        httpd.serve_forever()
except Exception as e:
    print(f"Error starting server: {e}", file=sys.stderr)
    sys.exit(1)
