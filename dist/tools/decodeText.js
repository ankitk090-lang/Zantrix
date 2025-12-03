"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeText = decodeText;
async function decodeText(text, encoding) {
    try {
        let decoded = "";
        if (encoding === "base64") {
            decoded = Buffer.from(text, "base64").toString("utf-8");
        }
        else if (encoding === "hex") {
            decoded = Buffer.from(text, "hex").toString("utf-8");
        }
        else if (encoding === "url") {
            decoded = decodeURIComponent(text);
        }
        else {
            return {
                content: [
                    {
                        type: "text",
                        text: `Unsupported encoding: ${encoding}. Supported: base64, hex, url`,
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: `Decoded (${encoding}):\n${decoded}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error decoding text: ${error.message}`,
                },
            ],
        };
    }
}
