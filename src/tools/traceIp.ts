import axios from "axios";

interface IpApiResponse {
    status: string;
    message?: string;
    query: string;
    country: string;
    regionName: string;
    city: string;
    isp: string;
    org: string;
    lat: number;
    lon: number;
}

export async function traceIp(ip: string): Promise<{ content: { type: "text"; text: string }[] }> {
    try {
        const response = await axios.get<IpApiResponse>(`http://ip-api.com/json/${ip}`);
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
    } catch (error: any) {
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
