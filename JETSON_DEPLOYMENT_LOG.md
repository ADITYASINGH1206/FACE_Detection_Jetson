# Jetson Deployment & Networking Log

This document records the exact steps and debugging fixes applied to get the Jetson Nano Edge AI successfully beaming data to the local Mac backend over a cellular hotspot.

## 1. Network Bridging (Overcoming Phone Hotspot Isolation)
**The Problem**: The Jetson Nano (connected via USB tethering) could not communicate with the Mac (connected via Wi-Fi hotspot on the same phone). Android natively isolates these two interfaces, dropping all packets between them.
**The Fix**:
- Bypassed the local network entirely by using a public SSH reverse tunnel on the Mac.
- **Command used on Mac**: `ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net`
- This exposes the local `localhost:3000` Express server to a public `serveo.net` URL.
- **Edge Bridge Updates (`edge_bridge.py`)**: 
  - Updated the script to pull from the Serveo URL.
  - Increased the HTTP request `timeout` from `5` to `30` seconds because the cellular uplink was taking >5s to complete the POST requests (resulting in `408 Request Timeout`).
  - Added the `Bypass-Tunnel-Reminder: true` header to automatically bypass security warning splash screens on tunneling services.

## 2. RTSP Camera Streaming (Fixing IRAP / NVPARSER Errors)
**The Problem**: The default `uridecodebin` in DeepStream relies heavily on UDP for RTSP streams. This resulted in packet loss from the CCTV cameras, causing infinite `NVPARSER: HEVC: Seeking is not performed on IRAP picture` errors and pipeline freezing.
**The Fix**:
- Rewrote the source bin generation in `edge_daemon.py` (`create_source_bin`).
- Replaced the generic `uridecodebin` with an explicit, hardware-accelerated H.265 pipeline that forces TCP (`protocols=4`):
  ```
  rtspsrc location=... latency=100 protocols=4 ! rtph265depay ! h265parse ! nvv4l2decoder ! nvvidconv
  ```
- Explicitly linked the GhostPad output of the `capsfilter` to the bin's `src` pad for the RTSP branch to ensure it correctly feeds into the `nvstreammux`.

## 3. Backend Routing & Node.js Binding
**The Problem**: During testing with Localtunnel, the tunnel returned a `502 Bad Gateway`. This happened because we explicitly forced the Express backend to bind to `0.0.0.0` (IPv4), but Localtunnel routes internal traffic to `localhost` via IPv6 (`::1`), resulting in Node.js rejecting the connection.
**The Fix**:
- Reverted `app.js` in `attendance-express-backend` to simply `server.listen(PORT, ...)` without specifying `0.0.0.0`. This allows Node to accept dual-stack (IPv4 and IPv6) loopback connections, instantly resolving the Bad Gateway errors.

## 4. Enrollment Procedure Reference
If the Jetson database is ever wiped or new students are added, here is the verified pipeline to re-enroll mock data locally on the Jetson:
1. Ensure the student images are placed in the `image_db/<student_name>/` directory.
2. Run `python3 enroll_trt.py` with no arguments.
3. The script automatically detects all faces, applies symmetric padding, extracts the ONNX embeddings, averages them, and saves them to the SQLite database.

## Next Steps (Live Testing)
For the next session involving live feed and in-depth testing:
1. **Launch Backend**: Start the Mac Node.js backend.
2. **Launch Tunnel**: Run the Serveo SSH command on the Mac. Open the generated link in the Mac browser first to bypass any security splash screens.
3. **Update Jetson**: `export` the new Serveo URL on the Jetson or edit `edge_bridge.py`.
4. **Start Edge Services**: Run `edge_daemon.py` to begin analyzing the RTSP feed, followed by `edge_bridge.py` to push the detections.
