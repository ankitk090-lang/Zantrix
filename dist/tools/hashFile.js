"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashFile = hashFile;
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
async function hashFile(filePath) {
    try {
        const fileBuffer = await promises_1.default.readFile(filePath);
        const md5 = crypto_1.default.createHash("md5").update(fileBuffer).digest("hex");
        const sha1 = crypto_1.default.createHash("sha1").update(fileBuffer).digest("hex");
        const sha256 = crypto_1.default.createHash("sha256").update(fileBuffer).digest("hex");
        return {
            content: [
                {
                    type: "text",
                    text: `Hashes for ${filePath}:\n\nMD5:    ${md5}\nSHA1:   ${sha1}\nSHA256: ${sha256}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error hashing file: ${error.message}`,
                },
            ],
        };
    }
}
