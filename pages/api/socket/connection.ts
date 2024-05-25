import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    res?.socket?.server?.io?.emit("thought", {
      thought: "I'm interpreting the page...",
    });
    return res.status(200).json("message");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
