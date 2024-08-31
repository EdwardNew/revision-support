import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
    const { paperTitle, paperAbstract, exactHighlightContent } =
        await req.json();

    const prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "user",
            content: `I am the author of a paper submitted to ICLR titled ${paperTitle} Below is the abstract ${paperAbstract}`,
        },
        {
            role: "user",
            content: `Explain what the following snippet means in a concise 1-2 sentence reponse: ${exactHighlightContent}`,
        },
        {
            role: "user",
            content: `Please also provide a link to the source if possible.`,
        },
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: prompt,
        // stream: true,
    });

    const completion = response.choices[0]?.message?.content;

    // const responseStream = new ReadableStream({
    //     async start(controller) {
    //         for await (const chunk of stream) {
    //             const content = chunk.choices[0]?.delta?.content || "";
    //             controller.enqueue(content);
    //         }
    //         controller.close();
    //     },
    // });

    // return new NextResponse(responseStream, {
    //     headers: { "Content-Type": "text/event-stream" },
    // });
    return NextResponse.json(completion);
}
