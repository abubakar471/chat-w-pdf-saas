import { OpenAIApi, Configuration } from "openai-edge";
// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export async function getEmbeddings(text: string) {
//     try {
//         const response = await openai.createEmbedding({
//             model: "text-embedding-ada-002",
//             input: text.replace(/\n/g, " "),
//         });
//         const result = await response.json();
//         console.log("open ai embedding result :", result)
//         return result.data[0].embedding as number[];
//     } catch (error) {
//         console.log("error calling openai embeddings api", error);
//         throw error;
//     }
// }

import { OpenAIEmbeddings } from "@langchain/openai";

export async function getEmbeddings(text: string) {
    try {
        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-3-small",
        });

        const vectors = await embeddings.embedDocuments([text]);
        console.log("my openai embeddings : ", vectors)
        return vectors;
    } catch (err) {
        console.log("error calling openai embeddings api", err);
        throw err;
    }
}