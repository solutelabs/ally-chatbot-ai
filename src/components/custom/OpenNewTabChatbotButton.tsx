"use client"

import { Button } from "../ui/button"

export default function OpenNewTabChatbotButton({ chatbotId }: { chatbotId: string }) {
    return (
        <>
            <p className="text-gray-500 text-sm mt-6">
                Open Chatbot in New Tab
            </p>
            <Button onClick={
                () => {
                    window.open(`http://localhost:3000/chatbot-iframe/${chatbotId}`, '_blank')
                }
            }
                className='mt-2 w-[10vw] font-bold bg-gray-200'
                variant="outline">
                Visit
            </Button>
        </>
    )
}