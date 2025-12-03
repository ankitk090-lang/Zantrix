"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanFiles = scanFiles;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const SUSPICIOUS_EXTENSIONS = [".exe", ".bat", ".sh", ".vbs", ".cmd"];
const SUSPICIOUS_PATTERNS = ["malware", "virus", "trojan", "eval(", "exec("];
async function scanFiles(directory) {
    const results = [];
    async function scanDir(dir) {
        try {
            const entries = await promises_1.default.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path_1.default.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await scanDir(fullPath);
                }
                else if (entry.isFile()) {
                    // Check extension
                    const ext = path_1.default.extname(entry.name).toLowerCase();
                    if (SUSPICIOUS_EXTENSIONS.includes(ext)) {
                        results.push({ file: fullPath, reason: `Suspicious extension: ${ext}` });
                        continue; // Skip content check if extension is suspicious
                    }
                    // Check content (basic check for text files)
                    // Limit size to avoid reading huge files
                    try {
                        const stats = await promises_1.default.stat(fullPath);
                        if (stats.size < 1024 * 1024) { // 1MB limit
                            const content = await promises_1.default.readFile(fullPath, "utf-8");
                            for (const pattern of SUSPICIOUS_PATTERNS) {
                                if (content.includes(pattern)) {
                                    results.push({ file: fullPath, reason: `Contains suspicious pattern: ${pattern}` });
                                    break;
                                }
                            }
                        }
                    }
                    catch (err) {
                        // Ignore read errors (e.g., binary files)
                    }
                }
            }
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error scanning directory: ${error.message}`,
                    },
                ],
            };
        }
    }
    await scanDir(directory);
    if (results.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: "No suspicious files found.",
                },
            ],
        };
    }
    const formattedResults = results
        .map((r) => `- ${r.file}: ${r.reason}`)
        .join("\n");
    return {
        content: [
            {
                type: "text",
                text: `Found suspicious files:\n${formattedResults}`,
            },
        ],
    };
}
