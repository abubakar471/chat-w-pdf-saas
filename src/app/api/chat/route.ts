// import { Configuration, OpenAIApi } from "openai-edge";
// import { OpenAIStream, StreamingTextResponse } from "ai";

// export const runtime = 'edge';

// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY
// })

// const openai = new OpenAIApi(config);

// export async function POST(req: Request) {
//     try {
//         const { messages } = await req.json();
//         const response = await openai.createChatCompletion({
//             model: "gpt-3.5-turbo",
//             messages,
//             stream: true
//         });

//         const stream = OpenAIStream(response);

//         return new StreamingTextResponse(stream);
//     } catch (err) {
//         console.log(err);
//     }
// }


import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Cohere, CohereClient } from "cohere-ai";
import { StreamingTextResponse, CohereStream } from 'ai';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const toCohereRole = (role: string): Cohere.ChatMessageRole => {
    if (role === 'user') {
        return Cohere.ChatMessageRole.User;
    }
    return Cohere.ChatMessageRole.Chatbot;
};

// export async function POST(req: Request) {
//     const { messages } = await req.json();
//     const chatHistory = messages.map((message: any) => ({
//         message: message.content,
//         role: toCohereRole(message.role),
//     }));
//     const lastMessage = chatHistory.pop();

//     const response = await cohere.chatStream({
//         message: lastMessage.message,
//         chatHistory,
//     });

//     const stream = new ReadableStream({
//         async start(controller) {
//             for await (const event of response) {
//                 if (event.eventType === 'text-generation') {
//                     controller.enqueue(event.text);
//                 }
//             }
//             controller.close();
//         },
//     });
//     // console.log(stream)
//     return new StreamingTextResponse(stream);

// }


// export async function POST(req: Request) {
//     try {
//         const { messages, input } = await req.json();
//         console.log({
//             messages, input
//         })
//         const model = new ChatCohere({
//             apiKey: process.env.COHERE_API_KEY, // Default
//             model: "command", // Default
//         });

//         const response = await model.invoke(
//             [new HumanMessage(messages[0].content)], {
//             documents: messages
//         }
//         )
//         console.log("response: ", response.content);
//         const stream = OpenAIStream(response.content);

//         return new StreamingTextResponse(stream);
//     } catch (err) {
//         console.log(err);
//     }
// }


export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const { messages } = await req.json();
    const chatHistory = messages.map((message: any) => ({
        message: message.content,
        role: toCohereRole(message.role),
    }));
    const lastMessage = chatHistory.pop();

    const body = JSON.stringify({
        prompt: lastMessage.message,
        history: chatHistory.map((entry: any) => ({ role: entry.sender, content: entry.message })),
        model: 'command-nightly',
        max_tokens: 20,
        stop_sequences: [],
        temperature: 0.9,
        return_likelihoods: 'NONE',
        stream: true,
    });

    const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        },
        body,
    });
    
    // Check for errors
    if (!response.ok) {
        return new Response(await response.text(), {
            status: response.status,
        });
    }

    // Extract the text response from the Cohere stream
    const stream = CohereStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}