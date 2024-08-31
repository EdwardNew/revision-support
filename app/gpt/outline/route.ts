import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

const responseFormat = JSON.stringify({
    Opening:
        "We would like to thank the reviewers for their constructive comments and valuable feedback. We greatly appreciate the time and effort put into reviewing our paper.",
    "Summary of Paper Contributions":
        "Our paper, Boosting of Thoughts (BoT), introduces an automated prompting framework for problem solving with LLMs by iteratively exploring and self-evaluating many trees of thoughts. Our experiments demonstrate that BoT achieves higher or comparable problem-solving rates than other advanced prompting approaches.",
    "Responses to Reviewers Concerns": {
        "Incorporate Theoretical Insights": {
            "Highlight how findings build on established ML theories":
                "We will address how our findings build on well-established ML theories and extend beyond practical applications of ML techniques. This will underscore the fundamental insights uncovered by our work.",
        },
        "Clarify Methodology": {
            "Discuss aggregation strategies and tree edge weights in appendix":
                "We will include details on aggregation strategies and tree edge weights in the appendix, mentioning that these were previously left out for brevity.",
            "Simplify abstract and methodology with clear descriptions":
                "We will revise the abstract and methodology sections to simplify explanations, using more straightforward language and clear, step-by-step descriptions of BoT's processes.",
            "Justify the small dataset in evaluation":
                "We will address and justify the use of a small dataset for evaluation, explaining its relevance and limitations.",
            "Clarify model aggregation and thought improvement processes":
                "We will clarify how the model aggregates and refines thoughts within the tree structure and how weaknesses in thoughts are identified and addressed.",
        },
    },
});

export async function POST(req: Request) {
    const { paperTitle, paperAbstract, allNotes, todoList } = await req.json();

    const prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "user",
            content:
                "I am developing a web application to assist paper authors in \
                summarizing their notes after reviewing feedback received from \
                ICLR conference reviewers, and to help them create an organized \
                plan for writing a rebuttal. Your task is to write a rebuttal \
                outline from the notes and to-do list. The author has already\
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
            content: `Here is the list of note objects with the note id, the note content, and the associtated review context: ${JSON.stringify(
                allNotes
            )}`,
        },
        {
            role: "user",
            content: `Here is the todo list: ${JSON.stringify(todoList)}`,
        },
        {
            role: "user",
            content: `Please use the to-do lists, notes and review context to \
            write an outline for the paper rebuttal. The rebuttal outline \
            contains following section [opening, summary of paper contributions, \
            responses to reviewers concerns]. The [opening] section thanks the \
            review for their constructive comments. The [summary of paper \
            contributions] section uses two sentences to highlight the key \
            contribution. The [responses to reviewers' concerns] section \
            should contain multiple bullet points according to the notes and \
            to-do list items. Ensure that each section is clearly labeled, \
            and that the responses are directly tied to the issues raised in \
            the reviews. Please output the entire outline in JSON format.`,
        },
        {
            role: "user",
            content: `Make sure to only include JSON and text in your response.\
            Do NOT include any formatting or references to ids. Your response \
            shoule look something like this: ${responseFormat}`,
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
