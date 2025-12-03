import axios from "axios";

export async function checkRobots(url: string): Promise<{ content: { type: "text"; text: string }[] }> {
    try {
        // Ensure URL has protocol
        if (!url.startsWith("http")) {
            url = `https://${url}`;
        }

        // Append /robots.txt if not present
        if (!url.endsWith("/robots.txt")) {
            url = url.endsWith("/") ? `${url}robots.txt` : `${url}/robots.txt`;
        }

        const response = await axios.get(url);

        return {
            content: [
                {
                    type: "text",
                    text: `robots.txt content for ${url}:\n\n${response.data}`,
                },
            ],
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error fetching robots.txt: ${error.message}`,
                },
            ],
        };
    }
}
