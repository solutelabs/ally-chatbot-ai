export default function convertToMB(bytes: number): string {
    return parseFloat((bytes / (1024 * 1024)).toFixed(2)).toString();
}