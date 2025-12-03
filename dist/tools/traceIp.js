"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceIp = traceIp;
const axios_1 = __importDefault(require("axios"));
async function traceIp(ip) {
    try {
        const response = await axios_1.default.get(`http://ip-api.com/json/${ip}`);
        const data = response.data;
        if (data.status === "fail") {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to trace IP: ${data.message}`,
                    },
                ],
            };
        }
        const info = [
            `IP: ${data.query}`,
            `Country: ${data.country}`,
            `Region: ${data.regionName}`,
            `City: ${data.city}`,
            `ISP: ${data.isp}`,
            `Org: ${data.org}`,
            `Lat/Lon: ${data.lat}, ${data.lon}`,
        ].join("\n");
        return {
            content: [
                {
                    type: "text",
                    text: info,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error tracing IP: ${error.message}`,
                },
            ],
        };
    }
}
