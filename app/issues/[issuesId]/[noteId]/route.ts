import { NextRequest, NextResponse } from "next/server";
import { issuesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
    req: NextRequest,
    { params }: { params: { issuesId: string; noteId: string } }
) {
    try {
        const issue_id = params.issuesId;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }

        const note_id = params.noteId;
        console.log("issueId:", issue_id, "noteId", note_id);
        if (!note_id || !ObjectId.isValid(note_id)) {
            return NextResponse.json(
                { message: "Invalid note ID format" },
                { status: 400 }
            );
        }

        const note = await issuesCollection.findOne({
            _id: new ObjectId(issue_id),
            "notes._id": new ObjectId(note_id),
        });

        return NextResponse.json({ note });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch notes", error },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { issuesId: string; noteId: string } }
) {
    try {
        const issue_id = params.issuesId;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const note_id = params.noteId;

        if (!note_id || !ObjectId.isValid(note_id)) {
            return NextResponse.json(
                { message: "Invalid note ID format" },
                { status: 400 }
            );
        }
        const result = await issuesCollection.updateOne(
            { _id: new ObjectId(issue_id) },
            { $pull: { notes: { _id: new ObjectId(note_id) } } as any }
        );

        return NextResponse.json({ message: "Item deleted", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete item", error },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { issuesId: string; noteId: string } }
) {
    try {
        const issue_id = params.issuesId;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }

        const note_id = params.noteId;
        console.log("issueId:", issue_id, "noteId", note_id);
        if (!note_id || !ObjectId.isValid(note_id)) {
            return NextResponse.json(
                { message: "Invalid note ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const result = await issuesCollection.updateOne(
            {
                _id: new ObjectId(issue_id),
                "notes._id": new ObjectId(note_id),
            },
            { $set: { "notes.$.comment": body } }
        );

        return NextResponse.json({ message: "Item updated", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update item", error },
            { status: 500 }
        );
    }
}
