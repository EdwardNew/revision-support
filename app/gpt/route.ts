import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
    const { prompt } = await req.json();
    // const prompt = "you are a helpful AI assistant";

    const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        stream: true,
    });

    const responseStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                controller.enqueue(content);
            }
            controller.close();
        },
    });

    return new NextResponse(responseStream, {
        headers: { "Content-Type": "text/event-stream" },
    });
}
