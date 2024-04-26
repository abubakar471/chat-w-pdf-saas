"use client"

import React, { useEffect } from 'react'
import { useChat } from "ai/react"
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';

const ChatComponent = () => {
    const { input, handleInputChange, handleSubmit, messages, data } = useChat({
        api: "/api/chat",
    });


    useEffect(() => {
        console.log("messages : ", messages);
    }, [messages])

    return (
        <div className='relative max-h-screen overflow-y-scroll'>
            <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>

            <MessageList messages={messages} />

            <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'>
                <div className="flex">
                    <Input value={input} onChange={handleInputChange} placeholder='Ask any question...' className='w-full outline-none border-non' />
                    <Button className='bg-blue-600 ml-2'>
                        <Send className='w-4 h-4' />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatComponent