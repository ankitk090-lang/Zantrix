"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLogs = searchLogs;
const promises_1 = __importDefault(require("fs/promises"));
async function searchLogs(filePath, keyword) {
    try {
        const content = await promises_1.default.readFile(filePath, "utf-8");
        const lines = content.split("\n");
        const matches = [];
        lines.forEach((line, index) => {
            if (line.includes(keyword)) {
                matches.push({ line: index + 1, text: line.trim() });
            }
        });
        if (matches.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No matches found for "${keyword}" in ${filePath}`,
                    },
                ],
            };
        }
        // Limit output
        const displayMatches = matches.slice(0, 50);
        const moreCount = matches.length - 50;
        const formattedMatches = displayMatches
            .map((m) => `Line ${m.line}: ${m.text}`)
            .join("\n");
        const moreText = moreCount > 0 ? `\n...and ${moreCount} more matches` : "";
        return {
            content: [
                {
                    type: "text",
                    text: `Found ${matches.length} matches for "${keyword}" in ${filePath}:\n\n${formattedMatches}${moreText}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error searching logs: ${error.message}`,
                },
            ],
        };
    }
}
