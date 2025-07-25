export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        }),
      }
    );

    const result = await response.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
