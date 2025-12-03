import { passwordStrength } from "../src/tools/passwordStrength";
import { decodeText } from "../src/tools/decodeText";
import { hashFile } from "../src/tools/hashFile";
import path from "path";
import fs from "fs/promises";

async function runTests() {
    console.log("--- Testing passwordStrength ---");
    const weak = await passwordStrength("123456");
    console.log("Weak:", JSON.stringify(weak, null, 2));
    const strong = await passwordStrength("StrongP@ssw0rd!");
    console.log("Strong:", JSON.stringify(strong, null, 2));

    console.log("\n--- Testing decodeText ---");
    const decoded = await decodeText("SGVsbG8gV29ybGQ=", "base64");
    console.log("Base64:", JSON.stringify(decoded, null, 2));

    console.log("\n--- Testing hashFile ---");
    const testFile = path.resolve("test_hash.txt");
    await fs.writeFile(testFile, "hello world");
    const hash = await hashFile(testFile);
    console.log("Hash:", JSON.stringify(hash, null, 2));
    await fs.unlink(testFile);
}

runTests().catch(console.error);
