# shadcn installation
npx shadcn-ui@latest init
npx shadcn-ui@latest add

# gradient background color took from this site
https://hypercolor.dev/

# drizzle-orm installation
yarn add drizzle-orm
yarn add @neondatabase/serverless
yarn add drizzle-kit
yarn add dotenv
<!-- to push schema and update any changes in schema use the following command -->
npx drizzle-kit push:pg 
npx drizzle-kit studio

# main workflow
    1.obtain the pdf
    2. split and segment the pdf (langchain used)
    3.vectorise and embed individual documents
    4. store the vectors into pincone

    --search--
    1. embed the query
    2. query the pinecone db for similar vectors
    3. extract out the metadata of the similar vectors
    4. feed metadata into the open ai prompt, to generate desired output with the context of the pdf
