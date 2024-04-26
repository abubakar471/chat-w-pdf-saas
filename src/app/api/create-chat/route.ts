import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadCloudinaryIntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json();
        const { public_id, pdf_url } = body;

        console.log(body);
        await loadCloudinaryIntoPinecone(public_id);
        const chat_id = await db.insert(chats).values({
            pdfName: public_id,
            pdfUrl: pdf_url,
            publicId : public_id,
            userId: userId
        }).returning({
            insertedId: chats.id
        })

        return NextResponse.json(
            {
                chat_id: chat_id[0].insertedId,
            },
            { status: 200 })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    }
}