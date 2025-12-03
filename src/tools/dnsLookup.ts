import dns from "dns/promises";

export async function dnsLookup(domain: string): Promise<{ content: { type: "text"; text: string }[] }> {
    try {
        const results: string[] = [];

        // A Records
        try {
            const aRecords = await dns.resolve4(domain);
            results.push(`A Records: ${aRecords.join(", ")}`);
        } catch (e) { }

        // AAAA Records
        try {
            const aaaaRecords = await dns.resolve6(domain);
            results.push(`AAAA Records: ${aaaaRecords.join(", ")}`);
        } catch (e) { }

        // MX Records
        try {
            const mxRecords = await dns.resolveMx(domain);
            results.push(
                `MX Records:\n${mxRecords
                    .map((mx) => `  - ${mx.exchange} (Priority: ${mx.priority})`)
                    .join("\n")}`
            );
        } catch (e) { }

        // TXT Records
        try {
            const txtRecords = await dns.resolveTxt(domain);
            results.push(
                `TXT Records:\n${txtRecords.map((txt) => `  - ${txt.join(" ")}`).join("\n")}`
            );
        } catch (e) { }

        // NS Records
        try {
            const nsRecords = await dns.resolveNs(domain);
            results.push(`NS Records: ${nsRecords.join(", ")}`);
        } catch (e) { }

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
    } catch (error: any) {
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
