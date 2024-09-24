import { NextRequest, NextResponse } from "next/server";
import { papersCollection } from "@/lib/mongodb";

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
        const result = await papersCollection.insertOne(body);

        return NextResponse.json({ message: "Item created", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create item", error },
            { status: 500 }
        );
    }
}
