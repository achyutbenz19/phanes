import { getBrowser } from "@/lib/browser";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(422).json({ message: "Url not found" });
    }

    try {
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(url);

        res
            .status(200)
            .json({ message: "Browser launched and navigated successfully" });
    } catch (error) {
        console.error("Error launching browser:", error);
        res.status(500).json({ message: "Failed to launch browser" });
    }
}
