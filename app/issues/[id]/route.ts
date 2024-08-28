import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongobd";
import { ObjectId } from "mongodb";

const databaseName = "revision_support";
const collectionName = "issues";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const issue_id = params.id;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const items = await db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(issue_id) });
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
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const issue_id = params.id;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const newNote = { _id: new ObjectId(), ...body };
        const result = await db
            .collection(collectionName)
            .updateOne(
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const issue_id = params.id;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const note_id = req.nextUrl.searchParams.get("id");

        if (!note_id || !ObjectId.isValid(note_id)) {
            return NextResponse.json(
                { message: "Invalid note ID format" },
                { status: 400 }
            );
        }
        const result = await db
            .collection(collectionName)
            .updateOne(
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
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const issue_id = params.id;
        if (!ObjectId.isValid(issue_id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const note_id = req.nextUrl.searchParams.get("id");
        if (!note_id || !ObjectId.isValid(note_id)) {
            return NextResponse.json(
                { message: "Invalid note ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const result = await db.collection(collectionName).updateOne(
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
