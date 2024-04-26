import fs from "fs"
import fetch from "node-fetch"


export async function downloadFromCloudinary(public_id: string) {
    try {
        const response = await fetch(`https://res.cloudinary.com/dex1j2qai/raw/upload/v1714055771/${public_id}`)
        const file_name = `./tmp/pdf-${Date.now()}.pdf`;
        const pdfBuffer = await response.buffer();
        console.log("buffer", pdfBuffer)
        fs.writeFileSync(file_name, pdfBuffer as Buffer)
        return file_name;
    } catch (err) {
        console.log(err);
        return null;
    }
}