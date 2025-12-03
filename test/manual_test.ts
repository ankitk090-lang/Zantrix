import { scanFiles } from "../src/tools/scanFiles";
import { traceIp } from "../src/tools/traceIp";
import { scanNetwork } from "../src/tools/scanNetwork";
import { analyzeHeaders } from "../src/tools/analyzeHeaders";
import path from "path";
import fs from "fs/promises";

async function runTests() {
    console.log("--- Testing scanFiles ---");
    // Create a dummy suspicious file
    const testDir = path.resolve("./test_scan_dir");
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, "test.exe"), "fake binary content");
    await fs.writeFile(path.join(testDir, "malware.txt"), "This file contains malware pattern.");
    await fs.writeFile(path.join(testDir, "safe.txt"), "This is a safe file.");

    const scanResult = await scanFiles(testDir);
    console.log(JSON.stringify(scanResult, null, 2));

    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });

    console.log("\n--- Testing traceIp ---");
    const ipResult = await traceIp("8.8.8.8");
    console.log(JSON.stringify(ipResult, null, 2));

    console.log("\n--- Testing scanNetwork ---");
    // Scan localhost common ports
    const netResult = await scanNetwork("127.0.0.1", [80, 443, 3000]); // Assuming some might be closed, but it tests the logic
    console.log(JSON.stringify(netResult, null, 2));

    console.log("\n--- Testing analyzeHeaders ---");
    const headerResult = await analyzeHeaders("https://www.google.com");
    console.log(JSON.stringify(headerResult, null, 2));
}

runTests().catch(console.error);
