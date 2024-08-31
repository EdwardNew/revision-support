import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongobd";
import { ObjectId } from "mongodb";

const databaseName = "revision_support";
const collectionName = "rebuttals";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const client = await clientPromise;
        const db = client.db(databaseName);
        const rebuttal_id = params.id;
        if (!ObjectId.isValid(rebuttal_id)) {
            return NextResponse.json(
                { message: "Invalid Rebuttal ID format" },
                { status: 400 }
            );
        }
        const items = await db
            .collection(collectionName)
            .findOne(
                { _id: new ObjectId(rebuttal_id) },
                { projection: { todos: 1 } }
            );
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch todos", error },
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
        const rebuttal_id = params.id;
        if (!ObjectId.isValid(rebuttal_id)) {
            return NextResponse.json(
                { message: "Invalid Rebuttal ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const result = await db.collection(collectionName).updateOne(
            {
                _id: new ObjectId(rebuttal_id),
            },
            { $set: { todos: body } }
        );

        return NextResponse.json({ message: "Todos updated", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update todos", error },
            { status: 500 }
        );
    }
}
