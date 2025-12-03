"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoisLookup = whoisLookup;
// @ts-ignore
const whois_1 = __importDefault(require("whois"));
async function whoisLookup(domain) {
    return new Promise((resolve) => {
        whois_1.default.lookup(domain, (err, data) => {
            if (err) {
                resolve({
                    content: [
                        {
                            type: "text",
                            text: `Error performing WHOIS lookup: ${err.message}`,
                        },
                    ],
                });
                return;
            }
            resolve({
                content: [
                    {
                        type: "text",
                        text: `WHOIS Data for ${domain}:\n\n${data}`,
                    },
                ],
            });
        });
    });
}
