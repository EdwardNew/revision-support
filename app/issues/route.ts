import { NextRequest, NextResponse } from "next/server";
import { issuesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    try {
        const items = await issuesCollection.find().toArray();
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
        const result = await issuesCollection.insertOne(body);

        return NextResponse.json({ message: "Item created", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create item", error },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const result = await issuesCollection.deleteOne({
            _id: new ObjectId(id),
        });

        return NextResponse.json({ message: "Item deleted", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete item", error },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid Issue ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const result = await issuesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: body }
        );

        return NextResponse.json({ message: "Item updated", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update item", error },
            { status: 500 }
        );
    }
}
