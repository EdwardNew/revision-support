import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

const responseFormat = JSON.stringify({
    type: "doc",
    content: [
        {
            type: "bulletList",
            content: [
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "general topic 1",
                                },
                            ],
                        },
                        {
                            type: "bulletList",
                            content: [
                                {
                                    type: "listItem",
                                    content: [
                                        {
                                            type: "customParagraph",
                                            attrs: {
                                                "data-ids":
                                                    "66fb00ea0b32384831c9ec4f",
                                            },
                                            content: [
                                                {
                                                    type: "text",
                                                    text: "specific to do item 1",
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    type: "listItem",
                                    content: [
                                        {
                                            type: "customParagraph",
                                            attrs: {
                                                "data-ids":
                                                    "66f8bf982acfbec82fde54c9,66fb00ea0b32384831c9ec4f",
                                            },
                                            content: [
                                                {
                                                    type: "text",
                                                    text: "specific to do item 2",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "general topic 2",
                                },
                            ],
                        },
                        {
                            type: "bulletList",
                            content: [
                                {
                                    type: "listItem",
                                    content: [
                                        {
                                            type: "customParagraph",
                                            attrs: {
                                                "data-ids":
                                                    "66f7d7107dd26ab39d700e16,66f43c932d27c7da56e33f67",
                                            },
                                            content: [
                                                {
                                                    type: "text",
                                                    text: "specific to do item 1",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "general topic 3",
                                },
                            ],
                        },
                        {
                            type: "bulletList",
                            content: [
                                {
                                    type: "listItem",
                                    content: [
                                        {
                                            type: "customParagraph",
                                            attrs: {
                                                "data-ids":
                                                    "66f7d7107dd26ab39d700e16,66f43c932d27c7da56e33f67",
                                            },
                                            content: [
                                                {
                                                    type: "text",
                                                    text: "specific to do item 1",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});

export async function POST(req: Request) {
    const { paperTitle, paperAbstract, allNotes } = await req.json();

    const prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "user",
            content:
                "I am developing a web application to assist paper authors in \
                summarizing their notes after reviewing feedback received from \
                ICLR conference reviewers, and to help them create an organized \
                plan for writing a rebuttal. Your task is to synthesize the \
                authors' notes into a clear to-do list. The author has already\
                annotated the reviews and generated a list of note objects that\
                consist of id, note, and review_context fields. I \
                will provide the abstract of the paper, and the list of the notes taken by the \
                author. \
                Please create a two-level bullet point summary where the first \
                level is a general topic, and the second level is a specific \
                to-do action.",
        },
        {
            role: "user",
            content: `Here is the abstract of the paper ${paperTitle}: ${paperAbstract}`,
        },
        {
            role: "user",
            content: `Here is the list of note objects with the note id, the note \
            content, and the associtated review context: 
            ${JSON.stringify(allNotes)}`,
        },
        {
            role: "user",
            content: `Each bullet point should be concise (between 10 to 25 words) \
            and must include the note IDs as references. Please output the to-do \
            list in the tiptap rich text editor's json format with paragraph elements\
            replaced by an element from a custom extension called 'customParagraph'.\
            Each custom paragraph element should have an 'attrs' field with a \
            'data-ids' field that is a comma-separated list of the ids of the \
            notes that were used to generate the specific bullet.\
            Here's an example response : ${responseFormat}`,
        },
        {
            role: "user",
            content: `Make sure each to-do item is actionable and directly \
            related to the corresponding notes and review context provided. \
            The general topic should less than 5 words. Only include the JSON \
            object, do NOT include any formatting.`,
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

export async function GET(req: Request) {
    return NextResponse.json({ message: "summary" });
}
