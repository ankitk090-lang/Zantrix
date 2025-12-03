# Zantrix - Cybersecurity MCP Server

Zantrix is a powerful Model Context Protocol (MCP) server that provides a suite of essential cybersecurity diagnostic tools and network analysis utilities. It is designed to integrate seamlessly with MCP clients like Claude Desktop to bring security capabilities directly into your AI workflow.

## Features

- **`scan_files`**: Recursively scans a directory for suspicious file extensions and content patterns.
- **`trace_ip`**: Traces an IP address to provide geolocation and ISP information.
- **`scan_network`**: Scans a target host for open ports.
- **`analyze_headers`**: Analyzes the HTTP security headers of a given URL.
- **`dns_lookup`**: Performs detailed DNS lookups (A, MX, TXT, NS).
- **`whois_lookup`**: Retrieves domain registration details.
- **`ssl_inspector`**: Inspects SSL certificates for validity and details.
- **`find_subdomains`**: Finds subdomains using certificate transparency logs.
- **`check_robots`**: Fetches and displays robots.txt.
- **`hash_file`**: Calculates MD5, SHA1, and SHA256 hashes of a file.
- **`search_logs`**: Searches for keywords in log files.
- **`password_strength`**: Analyzes password complexity.
- **`decode_text`**: Decodes Base64, Hex, or URL-encoded text.

## Prerequisites

- Node.js (v16 or higher)
- npm

## Installation

1.  Clone this repository:
    ```bash
    git clone https://github.com/yourusername/zantrix.git
    cd zantrix
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```

## How to Run

To use these tools within a chat interface, you need an MCP Client like the **Claude Desktop** app.

1.  Download and install [Claude Desktop](https://claude.ai/download).
2.  Open the Claude Desktop config file:
    - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
    - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
3.  Add this server to the `mcpServers` object. Replace `/absolute/path/to/zantrix` with the actual absolute path to the cloned directory.

    ```json
    {
      "mcpServers": {
        "zantrix": {
          "command": "node",
          "args": [
            "/absolute/path/to/zantrix/dist/index.js"
          ]
        }
      }
    }
    ```
4.  Restart Claude Desktop. You should now see a hammer icon indicating the tools are available.

## License

This project is licensed under the ISC License.


