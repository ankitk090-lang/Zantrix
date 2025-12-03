// @ts-ignore
import whois from "whois";

export async function whoisLookup(domain: string): Promise<{ content: { type: "text"; text: string }[] }> {
    return new Promise((resolve) => {
        whois.lookup(domain, (err: any, data: any) => {
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
