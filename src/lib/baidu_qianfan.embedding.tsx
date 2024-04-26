import { BaiduQianfanEmbeddings } from "@langchain/community/embeddings/baidu_qianfan";

export const getBaiduEmbedding = async (text: string) => {
    const embeddings = new BaiduQianfanEmbeddings({baiduApiKey : });
    const res = await embeddings.embedQuery(text);
    console.log("result baidu embedding : ", res);
}