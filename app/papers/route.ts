import { NextRequest, NextResponse } from "next/server";
import {
    issuesCollection,
    papersCollection,
    rebuttalsCollection,
} from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    try {
        const items = await papersCollection.find().toArray();

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch items", error },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // create new issue
        const newEmptyIssue = {
            notes: [],
        };
        const issueResult = await issuesCollection.insertOne(newEmptyIssue);
        const issue_id = issueResult.insertedId;

        //create new rebuttal
        const newEmptyRebuttal = {
            todos: [],
            outline: [],
        };
        const rebuttalResult = await rebuttalsCollection.insertOne(
            newEmptyRebuttal
        );
        const rebuttal_id = rebuttalResult.insertedId;

        // create new paper and link issue and rebuttal
        const newPaper = {
            _id: new ObjectId(),
            reviews: body.reviews || [],
            abstract: body.abstract || "",
            pdf: body.pdf || "",
            title: body.title || "Untitled Paper",
            issues_id: issue_id,
            rebuttal_id: rebuttal_id,
            paper_id: body.paper_id || null,
        };
        const paperResult = await papersCollection.insertOne(newPaper);

        console.log("Documents created successfully:");
        console.log(`Issue Id: ${issue_id}`);
        console.log(`Rebuttal Id: ${rebuttal_id}`);
        console.log(`Paper Id: ${paperResult.insertedId}`);

        return new Response(
            JSON.stringify({
                message: "Documents created successfully",
                issueId: issue_id,
                rebuttalId: rebuttal_id,
                paperId: paperResult.insertedId,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating documents:", error);

        return new Response(
            JSON.stringify({ message: "Error creating documents", error }),
            { status: 500 }
        );
    }
}
