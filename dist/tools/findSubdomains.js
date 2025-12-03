"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSubdomains = findSubdomains;
const axios_1 = __importDefault(require("axios"));
async function findSubdomains(domain) {
    try {
        const response = await axios_1.default.get(`https://crt.sh/?q=%.${domain}&output=json`);
        const data = response.data;
        if (!Array.isArray(data)) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No subdomains found or error querying crt.sh for ${domain}`,
                    },
                ],
            };
        }
        const subdomains = new Set();
        data.forEach((entry) => {
            const nameValue = entry.name_value;
            nameValue.split("\n").forEach((sub) => {
                if (!sub.includes("*")) {
                    subdomains.add(sub);
                }
            });
        });
        const sortedSubdomains = Array.from(subdomains).sort();
        if (sortedSubdomains.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No subdomains found for ${domain}`,
                    },
                ],
            };
        }
        // Limit output if too many
        const displayList = sortedSubdomains.slice(0, 50);
        const moreCount = sortedSubdomains.length - 50;
        const moreText = moreCount > 0 ? `\n...and ${moreCount} more` : "";
        return {
            content: [
                {
                    type: "text",
                    text: `Found ${sortedSubdomains.length} subdomains for ${domain}:\n\n${displayList.join("\n")}${moreText}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error finding subdomains: ${error.message}`,
                },
            ],
        };
    }
}
