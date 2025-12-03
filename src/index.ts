#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Import tool implementations
import { scanFiles } from "./tools/scanFiles.js";
import { traceIp } from "./tools/traceIp.js";
import { scanNetwork } from "./tools/scanNetwork.js";
import { analyzeHeaders } from "./tools/analyzeHeaders.js";
import { dnsLookup } from "./tools/dnsLookup.js";
import { whoisLookup } from "./tools/whoisLookup.js";
import { sslInspector } from "./tools/sslInspector.js";
import { findSubdomains } from "./tools/findSubdomains.js";
import { checkRobots } from "./tools/checkRobots.js";
import { hashFile } from "./tools/hashFile.js";
import { searchLogs } from "./tools/searchLogs.js";
import { passwordStrength } from "./tools/passwordStrength.js";
import { decodeText } from "./tools/decodeText.js";

// Create server instance
const server = new McpServer({
    name: "zantrix",
    version: "1.0.0",
});

// Register tools
server.tool(
    "scan_files",
    "Recursively scan a directory for suspicious files based on extensions and content patterns.",
    {
        directory: z.string().describe("The absolute path of the directory to scan"),
    },
    async ({ directory }) => {
        return await scanFiles(directory);
    }
);

server.tool(
    "trace_ip",
    "Trace an IP address to get geolocation and ISP information.",
    {
        ip: z.string().describe("The IP address to trace"),
    },
    async ({ ip }) => {
        return await traceIp(ip);
    }
);

server.tool(
    "scan_network",
    "Scan a target host or network for open ports.",
    {
        target: z.string().describe("The target hostname or IP address"),
        ports: z.array(z.number()).optional().describe("List of ports to scan (default: common ports)"),
    },
    async ({ target, ports }) => {
        return await scanNetwork(target, ports);
    }
);

server.tool(
    "analyze_headers",
    "Analyze HTTP security headers of a URL.",
    {
        url: z.string().describe("The URL to analyze"),
    },
    async ({ url }) => {
        return await analyzeHeaders(url);
    }
);

server.tool(
    "dns_lookup",
    "Perform a detailed DNS lookup (A, MX, TXT, NS) for a domain.",
    {
        domain: z.string().describe("The domain name to lookup"),
    },
    async ({ domain }) => {
        return await dnsLookup(domain);
    }
);

server.tool(
    "whois_lookup",
    "Perform a WHOIS lookup for a domain to find registration details.",
    {
        domain: z.string().describe("The domain name to lookup"),
    },
    async ({ domain }) => {
        return await whoisLookup(domain);
    }
);

server.tool(
    "ssl_inspector",
    "Inspect the SSL certificate of a domain.",
    {
        domain: z.string().describe("The domain name to inspect"),
    },
    async ({ domain }) => {
        return await sslInspector(domain);
    }
);

server.tool(
    "find_subdomains",
    "Find subdomains for a domain using public certificate transparency logs.",
    {
        domain: z.string().describe("The domain name to search"),
    },
    async ({ domain }) => {
        return await findSubdomains(domain);
    }
);

server.tool(
    "check_robots",
    "Fetch and display the robots.txt file of a URL.",
    {
        url: z.string().describe("The URL to check"),
    },
    async ({ url }) => {
        return await checkRobots(url);
    }
);

server.tool(
    "hash_file",
    "Calculate MD5, SHA1, and SHA256 hashes of a file.",
    {
        filePath: z.string().describe("The absolute path of the file to hash"),
    },
    async ({ filePath }) => {
        return await hashFile(filePath);
    }
);

server.tool(
    "search_logs",
    "Search for a keyword in a log file.",
    {
        filePath: z.string().describe("The absolute path of the log file"),
        keyword: z.string().describe("The keyword to search for"),
    },
    async ({ filePath, keyword }) => {
        return await searchLogs(filePath, keyword);
    }
);

server.tool(
    "password_strength",
    "Analyze the strength of a password.",
    {
        password: z.string().describe("The password to analyze"),
    },
    async ({ password }) => {
        return await passwordStrength(password);
    }
);

server.tool(
    "decode_text",
    "Decode text from Base64, Hex, or URL encoding.",
    {
        text: z.string().describe("The text to decode"),
        encoding: z.enum(["base64", "hex", "url"]).describe("The encoding format"),
    },
    async ({ text, encoding }) => {
        return await decodeText(text, encoding);
    }
);

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Zantrix MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
