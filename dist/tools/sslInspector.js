"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslInspector = sslInspector;
const tls_1 = __importDefault(require("tls"));
async function sslInspector(domain) {
    return new Promise((resolve) => {
        const options = {
            host: domain,
            port: 443,
            servername: domain,
        };
        const socket = tls_1.default.connect(options, () => {
            const cert = socket.getPeerCertificate();
            if (!cert || Object.keys(cert).length === 0) {
                resolve({
                    content: [{ type: "text", text: `No certificate found for ${domain}` }],
                });
                socket.end();
                return;
            }
            const info = [
                `Subject: ${cert.subject.CN}`,
                `Issuer: ${cert.issuer.CN}`,
                `Valid From: ${cert.valid_from}`,
                `Valid To: ${cert.valid_to}`,
                `Fingerprint: ${cert.fingerprint}`,
                `Serial Number: ${cert.serialNumber}`,
            ].join("\n");
            // Check expiry
            const validTo = new Date(cert.valid_to);
            const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const status = daysRemaining > 0
                ? `[VALID] Expires in ${daysRemaining} days`
                : `[EXPIRED] Expired ${Math.abs(daysRemaining)} days ago`;
            resolve({
                content: [
                    {
                        type: "text",
                        text: `SSL Certificate for ${domain}:\n\n${info}\n\nStatus: ${status}`,
                    },
                ],
            });
            socket.end();
        });
        socket.on("error", (err) => {
            resolve({
                content: [
                    {
                        type: "text",
                        text: `Error inspecting SSL: ${err.message}`,
                    },
                ],
            });
        });
    });
}
