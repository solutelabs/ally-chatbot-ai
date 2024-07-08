"use client"

import { toast } from 'sonner';
import { Copy } from 'lucide-react';

const CopyToClipboard = ({ text }: { text: string }) => {
    function copyToClipboard(): void {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    }
    return (
        <Copy className='w-4 h-4 cursor-pointer ml-4' onClick={copyToClipboard} />
    )
}

export default CopyToClipboard;