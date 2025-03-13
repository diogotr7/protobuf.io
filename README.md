# Protobuf Inspector

A lightweight web application for inspecting and visualizing Protocol Buffer binary data.

## Features

- Upload and view protobuf binary data with a hierarchical UI display
- Copy/paste hex and base64 encoded protobuf data
- Download binary data as files
- Share inspected data via shareable links
- Visualize different protobuf field types (messages, strings, varints, etc.)

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Chakra UI for clean, accessible components
- protobuf-ts for protocol buffer decoding

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   yarn
   ```
3. Start the development server:
   ```
   yarn dev
   ```

## Usage

- Paste hex or base64 encoded protobuf data
- Upload binary protobuf files
- Try the included examples to see how the inspector works
- Expand/collapse message sections to explore nested data

## Screenshot

![Protobuf Inspector Screenshot](/screenshot.png)

## License

MIT