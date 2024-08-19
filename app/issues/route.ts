import { NextRequest, NextResponse } from "next/server";
import clientPromise from "./mongobd";
import { ObjectId } from "mongodb";

const databaseName = "revision_support";
const collectionName = "issues";

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const items = await db.collection(collectionName).find().toArray();

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
        const client = await clientPromise;
        const db = client.db(databaseName);
        const body = await req.json();
        const result = await db.collection(collectionName).insertOne(body);

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
        const client = await clientPromise;
        const db = client.db(databaseName);
        const id = req.nextUrl.searchParams.get("id");
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
        const body = await req.json();
        const result = await db
            .collection(collectionName)
            .updateOne({ _id: new ObjectId(id) }, { $set: body });

        return NextResponse.json({ message: "Item updated", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update item", error },
            { status: 500 }
        );
    }
}
