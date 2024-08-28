import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

const example = JSON.stringify({
    "Add Theoretical Explanation":
        "Introduce a brief theoretical section explaining why BoT's iterative error analysis improves performance, linking it to existing ML theories.",
    "Expand Experimental Discussion":
        "Provide a concise analysis of experimental results, highlighting how specific components of BoT contribute to its effectiveness.",
});

export async function POST(req: Request) {
    const { paperTitle, paperAbstract, highlightContent, reviewContent } =
        await req.json();

    const prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "user",
            content: `I am the author of a paper submitted to ICLR titled ${paperTitle} Below is the abstract ${paperAbstract}`,
        },
        {
            role: "user",
            content: `I received the following review: ${reviewContent}`,
        },
        {
            role: "user",
            content: `Please provide two concrete and constructive strategies to solve this concern: ${highlightContent}`,
        },
        {
            role: "user",
            content: `Please output the strategies in a single JSON object with the following format where strategy titles are keys and associated strategies are values. Only include the JSON object, do NOT include any formatting: ${example}`,
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
