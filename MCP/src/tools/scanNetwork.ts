import net from "net";

export async function scanNetwork(target: string, ports: number[] = [21, 22, 80, 443, 3000, 8000, 8080]): Promise<{ content: { type: "text"; text: string }[] }> {
    const results: string[] = [];

    const checkPort = (port: number): Promise<string | null> => {
        return new Promise((resolve) => {
            const socket = new net.Socket();
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
