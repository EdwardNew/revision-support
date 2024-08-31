import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongobd";
import { ObjectId } from "mongodb";

const databaseName = "revision_support";
const collectionName = "rebuttals";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const items = await db.collection(collectionName).find().toArray();

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch rebuttals", error },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const body = await req.json();
        const result = await db.collection(collectionName).insertOne(body);

        return NextResponse.json({ message: "rebuttal created", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create rebuttal", error },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const id = req.nextUrl.searchParams.get("id");
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid rebuttal ID format" },
                { status: 400 }
            );
        }
        const result = await db
            .collection(collectionName)
            .deleteOne({ _id: new ObjectId(id) });

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
        const client = await clientPromise;
        const db = client.db(databaseName);
        const id = req.nextUrl.searchParams.get("id");
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid rebuttal ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const result = await db
            .collection(collectionName)
            .updateOne({ _id: new ObjectId(id) }, { $set: body });
        return NextResponse.json({ message: "Rebuttal updated", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update rebuttal", error },
            { status: 500 }
        );
    }
}
