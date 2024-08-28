import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongobd";
import { ObjectId } from "mongodb";

const databaseName = "revision_support";
const collectionName = "papers";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const paper_id = params.id;
        if (!ObjectId.isValid(paper_id)) {
            return NextResponse.json(
                { message: "Invalid Paper ID format" },
                { status: 400 }
            );
        }
        const items = await db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(paper_id) });
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch items", error },
            { status: 500 }
        );
    }
}
