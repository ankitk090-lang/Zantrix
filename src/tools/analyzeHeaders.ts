import axios from "axios";

export async function analyzeHeaders(url: string): Promise<{ content: { type: "text"; text: string }[] }> {
    try {
        const response = await axios.head(url);
        const headers = response.headers;

        const securityHeaders = [
            "strict-transport-security",
            "content-security-policy",
            "x-frame-options",
            "x-content-type-options",
            "referrer-policy",
            "permissions-policy",
        ];

        const results: string[] = [];
        const missing: string[] = [];

        for (const header of securityHeaders) {
            if (headers[header]) {
                results.push(`[OK] ${header}: ${headers[header]}`);
            } else {
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
    } catch (error: any) {
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
