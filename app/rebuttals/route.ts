import { NextRequest, NextResponse } from "next/server";
import { rebuttalsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const items = await rebuttalsCollection.find().toArray();

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
        const body = await req.json();
        const result = await rebuttalsCollection.insertOne(body);

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
        const id = req.nextUrl.searchParams.get("id");
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid rebuttal ID format" },
                { status: 400 }
            );
        }
        const result = await rebuttalsCollection.deleteOne({
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
                { message: "Invalid rebuttal ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const result = await rebuttalsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: body }
        );
        return NextResponse.json({ message: "Rebuttal updated", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update rebuttal", error },
            { status: 500 }
        );
    }
}
