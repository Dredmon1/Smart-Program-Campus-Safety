import http.server
import socketserver
import webbrowser
import os
import threading
import time
import subprocess
import sys

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

def start_api_server():
    """Start the Flask API server in a subprocess."""
    try:
        subprocess.Popen(
            [sys.executable, 'api_server.py'],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("[API] Flask API server starting on port 5050...")
    except Exception as e:
        print(f"[API] Could not start API server: {e}")
        print("[API] Run 'python api_server.py' separately if needed.")

def open_browser():
    time.sleep(2)
    url = f"http://localhost:{PORT}/SMART%20Program%20Campus%20Safety%20Optimization.html"
    print(f"Opening {url} in browser...")
    webbrowser.open(url)

if __name__ == "__main__":
    # Change directory to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Start the API server in the background
    start_api_server()
    
    # Start browser in a separate thread
    threading.Thread(target=open_browser).start()

    print(f"\n{'='*50}")
    print(f"  SoCal-SMART Command System")
    print(f"  Dashboard:  http://localhost:{PORT}")
    print(f"  API Server: http://localhost:5050")
    print(f"{'='*50}")
    print("Press Ctrl+C to stop all servers.\n")
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServers stopped.")
