import fs from "fs/promises";
import path from "path";

interface ScanResult {
    file: string;
    reason: string;
}

const SUSPICIOUS_EXTENSIONS = [".exe", ".bat", ".sh", ".vbs", ".cmd"];
const SUSPICIOUS_PATTERNS = ["malware", "virus", "trojan", "eval(", "exec("];

export async function scanFiles(directory: string): Promise<{ content: { type: "text"; text: string }[] }> {
    const results: ScanResult[] = [];

    async function scanDir(dir: string) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    await scanDir(fullPath);
                } else if (entry.isFile()) {
                    // Check extension
                    const ext = path.extname(entry.name).toLowerCase();
                    if (SUSPICIOUS_EXTENSIONS.includes(ext)) {
                        results.push({ file: fullPath, reason: `Suspicious extension: ${ext}` });
                        continue; // Skip content check if extension is suspicious
                    }

                    // Check content (basic check for text files)
                    // Limit size to avoid reading huge files
                    try {
                        const stats = await fs.stat(fullPath);
                        if (stats.size < 1024 * 1024) { // 1MB limit
                            const content = await fs.readFile(fullPath, "utf-8");
                            for (const pattern of SUSPICIOUS_PATTERNS) {
                                if (content.includes(pattern)) {
                                    results.push({ file: fullPath, reason: `Contains suspicious pattern: ${pattern}` });
                                    break;
                                }
                            }
                        }
                    } catch (err) {
                        // Ignore read errors (e.g., binary files)
                    }
                }
            }
        } catch (error: any) {
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
