// api/gemini.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { userMessage } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userMessage }] }]
    })
  });

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  res.status(200).json({ reply });
}
