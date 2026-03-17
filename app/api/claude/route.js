import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const { prompt } = await req.json();
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2500,
  });
  const text = completion.choices[0].message.content.trim().replace(/```json|```/g, "").trim();
  return Response.json({ text });
}
