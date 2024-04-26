import { CohereEmbeddings } from "@langchain/cohere";

/* Embed queries */
export const getCohereEmbeddings = async (text: string) => {
    try {
        const embeddings = new CohereEmbeddings({
            apiKey: process.env.COHERE_API_KEY, // In Node.js defaults to process.env.COHERE_API_KEY
            batchSize: 48, // Default value if omitted is 48. Max value is 96
        });
        const res = await embeddings.embedQuery(text);
        console.log("co here query embed : ", res);
        return res;
        /* Embed documents */
        // const documentRes = await embeddings.embedDocuments([text]);
        // console.log("co here document embed : ", { documentRes });
    } catch (err) {
        console.log(err);
    }
}