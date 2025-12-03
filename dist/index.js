#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
// Import tool implementations
const scanFiles_js_1 = require("./tools/scanFiles.js");
const traceIp_js_1 = require("./tools/traceIp.js");
const scanNetwork_js_1 = require("./tools/scanNetwork.js");
const analyzeHeaders_js_1 = require("./tools/analyzeHeaders.js");
const dnsLookup_js_1 = require("./tools/dnsLookup.js");
const whoisLookup_js_1 = require("./tools/whoisLookup.js");
const sslInspector_js_1 = require("./tools/sslInspector.js");
const findSubdomains_js_1 = require("./tools/findSubdomains.js");
const checkRobots_js_1 = require("./tools/checkRobots.js");
const hashFile_js_1 = require("./tools/hashFile.js");
const searchLogs_js_1 = require("./tools/searchLogs.js");
const passwordStrength_js_1 = require("./tools/passwordStrength.js");
const decodeText_js_1 = require("./tools/decodeText.js");
// Create server instance
const server = new mcp_js_1.McpServer({
    name: "zantrix",
    version: "1.0.0",
});
// Register tools
server.tool("scan_files", "Recursively scan a directory for suspicious files based on extensions and content patterns.", {
    directory: zod_1.z.string().describe("The absolute path of the directory to scan"),
}, async ({ directory }) => {
    return await (0, scanFiles_js_1.scanFiles)(directory);
});
server.tool("trace_ip", "Trace an IP address to get geolocation and ISP information.", {
    ip: zod_1.z.string().describe("The IP address to trace"),
}, async ({ ip }) => {
    return await (0, traceIp_js_1.traceIp)(ip);
});
server.tool("scan_network", "Scan a target host or network for open ports.", {
    target: zod_1.z.string().describe("The target hostname or IP address"),
    ports: zod_1.z.array(zod_1.z.number()).optional().describe("List of ports to scan (default: common ports)"),
}, async ({ target, ports }) => {
    return await (0, scanNetwork_js_1.scanNetwork)(target, ports);
});
server.tool("analyze_headers", "Analyze HTTP security headers of a URL.", {
    url: zod_1.z.string().describe("The URL to analyze"),
}, async ({ url }) => {
    return await (0, analyzeHeaders_js_1.analyzeHeaders)(url);
});
server.tool("dns_lookup", "Perform a detailed DNS lookup (A, MX, TXT, NS) for a domain.", {
    domain: zod_1.z.string().describe("The domain name to lookup"),
}, async ({ domain }) => {
    return await (0, dnsLookup_js_1.dnsLookup)(domain);
});
server.tool("whois_lookup", "Perform a WHOIS lookup for a domain to find registration details.", {
    domain: zod_1.z.string().describe("The domain name to lookup"),
}, async ({ domain }) => {
    return await (0, whoisLookup_js_1.whoisLookup)(domain);
});
server.tool("ssl_inspector", "Inspect the SSL certificate of a domain.", {
    domain: zod_1.z.string().describe("The domain name to inspect"),
}, async ({ domain }) => {
    return await (0, sslInspector_js_1.sslInspector)(domain);
});
server.tool("find_subdomains", "Find subdomains for a domain using public certificate transparency logs.", {
    domain: zod_1.z.string().describe("The domain name to search"),
}, async ({ domain }) => {
    return await (0, findSubdomains_js_1.findSubdomains)(domain);
});
server.tool("check_robots", "Fetch and display the robots.txt file of a URL.", {
    url: zod_1.z.string().describe("The URL to check"),
}, async ({ url }) => {
    return await (0, checkRobots_js_1.checkRobots)(url);
});
server.tool("hash_file", "Calculate MD5, SHA1, and SHA256 hashes of a file.", {
    filePath: zod_1.z.string().describe("The absolute path of the file to hash"),
}, async ({ filePath }) => {
    return await (0, hashFile_js_1.hashFile)(filePath);
});
server.tool("search_logs", "Search for a keyword in a log file.", {
    filePath: zod_1.z.string().describe("The absolute path of the log file"),
    keyword: zod_1.z.string().describe("The keyword to search for"),
}, async ({ filePath, keyword }) => {
    return await (0, searchLogs_js_1.searchLogs)(filePath, keyword);
});
server.tool("password_strength", "Analyze the strength of a password.", {
    password: zod_1.z.string().describe("The password to analyze"),
}, async ({ password }) => {
    return await (0, passwordStrength_js_1.passwordStrength)(password);
});
server.tool("decode_text", "Decode text from Base64, Hex, or URL encoding.", {
    text: zod_1.z.string().describe("The text to decode"),
    encoding: zod_1.z.enum(["base64", "hex", "url"]).describe("The encoding format"),
}, async ({ text, encoding }) => {
    return await (0, decodeText_js_1.decodeText)(text, encoding);
});
// Start server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Zantrix MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
