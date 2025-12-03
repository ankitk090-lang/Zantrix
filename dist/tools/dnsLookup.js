"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsLookup = dnsLookup;
const promises_1 = __importDefault(require("dns/promises"));
async function dnsLookup(domain) {
    try {
        const results = [];
        // A Records
        try {
            const aRecords = await promises_1.default.resolve4(domain);
            results.push(`A Records: ${aRecords.join(", ")}`);
        }
        catch (e) { }
        // AAAA Records
        try {
            const aaaaRecords = await promises_1.default.resolve6(domain);
            results.push(`AAAA Records: ${aaaaRecords.join(", ")}`);
        }
        catch (e) { }
        // MX Records
        try {
            const mxRecords = await promises_1.default.resolveMx(domain);
            results.push(`MX Records:\n${mxRecords
                .map((mx) => `  - ${mx.exchange} (Priority: ${mx.priority})`)
                .join("\n")}`);
        }
        catch (e) { }
        // TXT Records
        try {
            const txtRecords = await promises_1.default.resolveTxt(domain);
            results.push(`TXT Records:\n${txtRecords.map((txt) => `  - ${txt.join(" ")}`).join("\n")}`);
        }
        catch (e) { }
        // NS Records
        try {
            const nsRecords = await promises_1.default.resolveNs(domain);
            results.push(`NS Records: ${nsRecords.join(", ")}`);
        }
        catch (e) { }
        if (results.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No DNS records found for ${domain}`,
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: `DNS Records for ${domain}:\n\n${results.join("\n\n")}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error performing DNS lookup: ${error.message}`,
                },
            ],
        };
    }
}
