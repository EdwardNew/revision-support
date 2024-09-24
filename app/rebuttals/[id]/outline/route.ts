import { NextRequest, NextResponse } from "next/server";
import { rebuttalsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const rebuttal_id = params.id;
        if (!ObjectId.isValid(rebuttal_id)) {
            return NextResponse.json(
                { message: "Invalid Rebuttal ID format" },
                { status: 400 }
            );
        }
        const items = await rebuttalsCollection.findOne(
            { _id: new ObjectId(rebuttal_id) },
            { projection: { outline: 1 } }
        );
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch outline", error },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const rebuttal_id = params.id;
        if (!ObjectId.isValid(rebuttal_id)) {
            return NextResponse.json(
                { message: "Invalid Rebuttal ID format" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const result = await rebuttalsCollection.updateOne(
            {
                _id: new ObjectId(rebuttal_id),
            },
            { $set: { outline: body } }
        );

        return NextResponse.json({ message: "Outline updated", result });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update outline", error },
            { status: 500 }
        );
    }
}
