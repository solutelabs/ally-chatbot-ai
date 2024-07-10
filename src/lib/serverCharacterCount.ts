import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export default async function countCharacters(file: File): Promise<number> {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    switch (fileType) {
        case 'pdf':
            return await countPDFCharacters(file);
        case 'txt':
            return countTXTCharacters(file);
        case 'docx':
        case 'doc':
            return await countDOCCharacters(file);
        default:
            console.log('Unsupported file type.');
            return 0;
    }
}

async function countPDFCharacters(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const data = await pdf(Buffer.from(arrayBuffer));
    return data.text.length;
}


async function countTXTCharacters(file: File): Promise<number> {
    const text = await file.text();
    return text.length;
}

async function countDOCCharacters(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
    return result.value.length;
}