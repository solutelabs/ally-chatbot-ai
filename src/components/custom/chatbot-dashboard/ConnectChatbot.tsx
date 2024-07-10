import React from 'react'
import CopyToClipboard from '../CopyToClipboard'
import { Button } from '@/components/ui/button'
import { BookOpenIcon, LogOutIcon } from 'lucide-react'
import OpenNewTabChatbotButton from '../OpenNewTabChatbotButton'

const ConnectChatbot = ({ chatbotId }: { chatbotId: string }) => {


    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-sm mb-4">To add the chatbot anywhere on your website, add this iframe to your HTML code:</p>
            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md">
                <code className="text-gray-800 text-xs font-mono bg-gray-200 p-2 rounded">
                    {`<iframe \n

                src="https://ally.so/chatbot/${chatbotId}" \n
                width="100%" \n
                height="500px" \n
                frameborder="0"></iframe>`}
                </code>
            </div>
            <div className="flex flex-col items-center justify-center">

                <div className="flex flex-row items-center justify-center h-20">
                    <span className="text-gray-500 text-sm text-center">Copy the iframe code to your clipboard:</span>
                    <CopyToClipboard text={`<iframe
                    src="https://ally.so/chatbot/${chatbotId}" 
                    width="100%" 
                    height="500px" 
                    frameborder="0"></iframe>`} />
                </div>

                <p className='text-gray-500 text-sm text-center'>OR</p>

                <OpenNewTabChatbotButton chatbotId={chatbotId} />
            </div>
        </div>
    )

}

export default ConnectChatbot