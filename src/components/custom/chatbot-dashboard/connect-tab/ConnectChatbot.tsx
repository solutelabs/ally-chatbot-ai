import React from 'react'
import CopyToClipboard from '../../CopyToClipboard'
import OpenNewTabChatbotButton from '../../OpenNewTabChatbotButton'
import { getChatbot } from '@/app/(iframe)/chatbot-iframe/[chatbotId]/action'
import MakePublicChatbot from './MakePublicChatbot'

export default async function ConnectChatbot({ chatbotId }: { chatbotId: string }) {

    const chatbot = await getChatbot(chatbotId)

    const visibility: string = chatbot.chatBots.visibility;
    console.log(visibility)

    return (

        <>
            {visibility === 'public' ? (
                <div className="flex flex-col p-4 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500 text-sm mb-4">To add the chatbot anywhere on your website, add this iframe to your HTML code:</p>
                    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md">
                        <code className="text-gray-800 text-xs font-mono bg-gray-200 p-2 rounded">
                            {`<iframe \n
  
                  src="${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/${chatbotId}" \n
                  width="100%" \n
                  height="500px" \n
                  frameborder="0"></iframe>`}
                        </code>
                    </div>
                    <div className="flex flex-col items-center justify-center">

                        <div className="flex flex-row items-center justify-center h-20">
                            <span className="text-gray-500 text-sm text-center">Copy the iframe code to your clipboard:</span>
                            <CopyToClipboard text={`<iframe
                      src=${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/${chatbotId}" 
                      width="100%" 
                      height="500px" 
                      frameborder="0"></iframe>`} />
                        </div>

                        <p className='text-gray-500 text-sm text-center'>OR</p>

                        <OpenNewTabChatbotButton chatbotId={chatbotId} />
                    </div>
                </div>
            ) : (
                <MakePublicChatbot chatbotId={chatbotId} />
            )}


        </>
    )

}