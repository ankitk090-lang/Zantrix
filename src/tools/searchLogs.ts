import fs from "fs/promises";

export async function searchLogs(filePath: string, keyword: string): Promise<{ content: { type: "text"; text: string }[] }> {
    try {
        const content = await fs.readFile(filePath, "utf-8");
        const lines = content.split("\n");
        const matches: { line: number; text: string }[] = [];

        lines.forEach((line, index) => {
            if (line.includes(keyword)) {
                matches.push({ line: index + 1, text: line.trim() });
            }
        });

        if (matches.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `No matches found for "${keyword}" in ${filePath}`,
                    },
                ],
            };
        }

        // Limit output
        const displayMatches = matches.slice(0, 50);
        const moreCount = matches.length - 50;

        const formattedMatches = displayMatches
            .map((m) => `Line ${m.line}: ${m.text}`)
            .join("\n");

        const moreText = moreCount > 0 ? `\n...and ${moreCount} more matches` : "";

        return {
            content: [
                {
                    type: "text",
                    text: `Found ${matches.length} matches for "${keyword}" in ${filePath}:\n\n${formattedMatches}${moreText}`,
                },
            ],
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error searching logs: ${error.message}`,
                },
            ],
        };
    }
}
