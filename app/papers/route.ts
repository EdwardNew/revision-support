import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongobd";

const databaseName = "revision_support";
const collectionName = "papers";

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
