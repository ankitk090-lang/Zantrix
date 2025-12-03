"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRobots = checkRobots;
const axios_1 = __importDefault(require("axios"));
async function checkRobots(url) {
    try {
        // Ensure URL has protocol
        if (!url.startsWith("http")) {
            url = `https://${url}`;
        }
        // Append /robots.txt if not present
        if (!url.endsWith("/robots.txt")) {
            url = url.endsWith("/") ? `${url}robots.txt` : `${url}/robots.txt`;
        }
        const response = await axios_1.default.get(url);
        return {
            content: [
                {
                    type: "text",
                    text: `robots.txt content for ${url}:\n\n${response.data}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching robots.txt: ${error.message}`,
                },
            ],
        };
    }
}
