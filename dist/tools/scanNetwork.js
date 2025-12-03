"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanNetwork = scanNetwork;
const net_1 = __importDefault(require("net"));
async function scanNetwork(target, ports = [21, 22, 80, 443, 3000, 8000, 8080]) {
    const results = [];
    const checkPort = (port) => {
        return new Promise((resolve) => {
            const socket = new net_1.default.Socket();
            socket.setTimeout(2000); // 2 seconds timeout
            socket.on("connect", () => {
                socket.destroy();
                resolve(`Port ${port} is OPEN`);
            });
            socket.on("timeout", () => {
                socket.destroy();
                resolve(null);
            });
            socket.on("error", (err) => {
                socket.destroy();
                resolve(null);
            });
            socket.connect(port, target);
        });
    };
    const promises = ports.map((port) => checkPort(port));
    const scanResults = await Promise.all(promises);
    for (const result of scanResults) {
        if (result) {
            results.push(result);
        }
    }
    if (results.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `No open ports found on ${target} (scanned ports: ${ports.join(", ")})`,
                },
            ],
        };
    }
    return {
        content: [
            {
                type: "text",
                text: `Scan results for ${target}:\n${results.join("\n")}`,
            },
        ],
    };
}
