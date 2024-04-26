import { Pinecone, PineconeConfiguration, utils as PineconeUtils } from '@pinecone-database/pinecone';
import { downloadFromCloudinary } from './cloudinary.server';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter"
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertToAscii } from './utils';
import { getCohereEmbeddings } from './cohere.embedding';

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
}

type PDFPage = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    }
}

export async function loadCloudinaryIntoPinecone(public_id: string) {
    // 1. obtain the pdf -> download and read from the pdf
    console.log("downloading pdf contents from cloudinary...");
    const file_name = await downloadFromCloudinary(public_id);

    if (!file_name) {
        console.log("could not download from cloudinary");
    }

    console.log("in load pdf function : ", file_name);
    const loader = new PDFLoader(file_name!);
    const pages = (await loader.load()) as PDFPage[];

    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    // 3. vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    // 4. upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("chat-w-pdf-saas");
    const namespace = pineconeIndex.namespace(public_id);

    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);

    return documents[0];
}

async function embedDocument(doc: Document) {
    try {
        // const embeddings = await getEmbeddings(doc.pageContent);
        const embeddings = await getCohereEmbeddings(doc.pageContent);
        // create hash to id the vector within pinecone
        const hash = md5(doc.pageContent)

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        }
    } catch (err) {
        console.log("Error embedding document : ", err);
        throw err;
    }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, '')

    // split the docs 
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ])

    return docs
}