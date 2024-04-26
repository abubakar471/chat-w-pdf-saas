import ChatComponent from '@/components/ChatComponent'
import ChatSidebar from '@/components/ChatSidebar'
import PDFViewer from '@/components/PDFViewer'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        chatId: string
    }
}

const Page = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

    if (!_chats) {
        return redirect("/");
    }

    if (!_chats.find(chat => chat.id === parseInt(chatId))) {
        return redirect("/");
    }

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId));


    return (
        <div className='max-h-screen overflow-y-scroll flex'>
            <div className='w-full max-h-screen overflow-y-scroll flex'>
                {/* chat sidebar */}
                <div className="max-w-xs flex-[1]">
                    <ChatSidebar chatId={parseInt(chatId)} chats={_chats} />
                </div>

                <div className='max-h-screen p-4 overflow-y-scroll flex-[5]'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
                </div>

                <div className='flex-[3] border-l-4 border-l-slate-200'>
                    <ChatComponent />
                </div>
            </div>
        </div>
    )
}

export default Page