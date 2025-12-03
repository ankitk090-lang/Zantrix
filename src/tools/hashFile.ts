import fs from "fs/promises";
import crypto from "crypto";

export async function hashFile(filePath: string): Promise<{ content: { type: "text"; text: string }[] }> {
    try {
        const fileBuffer = await fs.readFile(filePath);

        const md5 = crypto.createHash("md5").update(fileBuffer).digest("hex");
        const sha1 = crypto.createHash("sha1").update(fileBuffer).digest("hex");
        const sha256 = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        return {
            content: [
                {
                    type: "text",
                    text: `Hashes for ${filePath}:\n\nMD5:    ${md5}\nSHA1:   ${sha1}\nSHA256: ${sha256}`,
                },
            ],
        };
    } catch (error: any) {
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
