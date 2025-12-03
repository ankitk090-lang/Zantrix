"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeHeaders = analyzeHeaders;
const axios_1 = __importDefault(require("axios"));
async function analyzeHeaders(url) {
    try {
        const response = await axios_1.default.head(url);
        const headers = response.headers;
        const securityHeaders = [
            "strict-transport-security",
            "content-security-policy",
            "x-frame-options",
            "x-content-type-options",
            "referrer-policy",
            "permissions-policy",
        ];
        const results = [];
        const missing = [];
        for (const header of securityHeaders) {
            if (headers[header]) {
                results.push(`[OK] ${header}: ${headers[header]}`);
            }
            else {
                missing.push(`[MISSING] ${header}`);
            }
        }
        const report = [
            `Security Headers Analysis for ${url}:`,
            "",
            "Present Headers:",
            ...results,
            "",
            "Missing Headers:",
            ...missing,
        ].join("\n");
        return {
            content: [
                {
                    type: "text",
                    text: report,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error analyzing headers: ${error.message}`,
                },
            ],
        };
    }
}
