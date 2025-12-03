"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scanFiles_1 = require("../src/tools/scanFiles");
const traceIp_1 = require("../src/tools/traceIp");
const scanNetwork_1 = require("../src/tools/scanNetwork");
const analyzeHeaders_1 = require("../src/tools/analyzeHeaders");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
async function runTests() {
    console.log("--- Testing scanFiles ---");
    // Create a dummy suspicious file
    const testDir = path_1.default.resolve("./test_scan_dir");
    await promises_1.default.mkdir(testDir, { recursive: true });
    await promises_1.default.writeFile(path_1.default.join(testDir, "test.exe"), "fake binary content");
    await promises_1.default.writeFile(path_1.default.join(testDir, "malware.txt"), "This file contains malware pattern.");
    await promises_1.default.writeFile(path_1.default.join(testDir, "safe.txt"), "This is a safe file.");
    const scanResult = await (0, scanFiles_1.scanFiles)(testDir);
    console.log(JSON.stringify(scanResult, null, 2));
    // Cleanup
    await promises_1.default.rm(testDir, { recursive: true, force: true });
    console.log("\n--- Testing traceIp ---");
    const ipResult = await (0, traceIp_1.traceIp)("8.8.8.8");
    console.log(JSON.stringify(ipResult, null, 2));
    console.log("\n--- Testing scanNetwork ---");
    // Scan localhost common ports
    const netResult = await (0, scanNetwork_1.scanNetwork)("127.0.0.1", [80, 443, 3000]); // Assuming some might be closed, but it tests the logic
    console.log(JSON.stringify(netResult, null, 2));
    console.log("\n--- Testing analyzeHeaders ---");
    const headerResult = await (0, analyzeHeaders_1.analyzeHeaders)("https://www.google.com");
    console.log(JSON.stringify(headerResult, null, 2));
}
runTests().catch(console.error);
