import { NextRequest, NextResponse } from "next/server";
import { issuesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
    req: NextRequest,
    { params }: { params: { issuesId: string } }
) {
    try {
        const issues_id = params.issuesId;
        if (!ObjectId.isValid(issues_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const items = await issuesCollection.findOne({
            _id: new ObjectId(issues_id),
        });
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch notes", error },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { issuesId: string } }
) {
    try {
        const issue_id = params.issuesId;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const newNote = { _id: new ObjectId(), ...body };
        const result = await issuesCollection.updateOne(
            { _id: new ObjectId(issue_id) },
            { $push: { notes: newNote } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { message: "Issue not found or no changes made" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Note added successfully",
            newNoteId: newNote._id,
            result,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to add note", error },
            { status: 500 }
        );
    }
}
