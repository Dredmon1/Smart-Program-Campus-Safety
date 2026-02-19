import http.server
import socketserver
import webbrowser
import os
import threading
import time

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

def open_browser():
    time.sleep(1.5)
    # The file name has spaces, so we need to encode them or rely on browser to handle it
    url = f"http://localhost:{PORT}/SMART%20Program%20Campus%20Safety%20Optimization.html"
    print(f"Opening {url} in browser...")
    webbrowser.open(url)

if __name__ == "__main__":
    # Change directory to the script's directory (absolute path)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Start browser in a separate thread
    threading.Thread(target=open_browser).start()

    print(f"Serving SoCal-SMART Dashboard at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server.")
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
