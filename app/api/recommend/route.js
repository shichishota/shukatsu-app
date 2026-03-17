import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req) {
  const { prompt } = await req.json();
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });
  return Response.json(msg);
}
