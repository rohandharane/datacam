# Geospatial Data Capture Interface

A minimalist web interface for capturing geospatial metadata using an Arduino MKR WiFi 1010 with rotary encoder.

## Features

- 6 data filters (Historical, Cultural, Infrastructure, Natural, Administrative, Economic)
- Real-time data display
- Session tracking
- Data export functionality
- WebSocket communication with Arduino

## Setup

1. Clone this repository
2. Ensure your Arduino is running on IP: 10.35.30.34
3. Open the index.html file in a web browser
4. Use the rotary encoder to cycle through filters
5. Press the capture button to record geospatial data

## Requirements

- Arduino MKR WiFi 1010
- Rotary encoder
- Socket.IO server running on Arduino
