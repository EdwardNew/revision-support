import { NextRequest, NextResponse } from "next/server";
import { papersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const paper_id = params.id;
        if (!ObjectId.isValid(paper_id)) {
            return NextResponse.json(
                { message: "Invalid Paper ID format" },
                { status: 400 }
            );
        }
        const items = await papersCollection.findOne({
            _id: new ObjectId(paper_id),
        });
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch items", error },
            { status: 500 }
        );
    }
}
