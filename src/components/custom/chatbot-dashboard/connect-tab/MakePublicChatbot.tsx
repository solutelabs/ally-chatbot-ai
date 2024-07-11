import { makePublic } from '@/app/(app)/dashboard/chatbot/[chatbotId]/[activeTab]/action'
import { Button } from '@/components/ui/button'
import React from 'react'
import MakePublicButton from './MakePublicButton'

const MakePublicChatbot = ({ chatbotId }: { chatbotId: string }) => {

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md w-full">
            <p className="text-gray-500 text-sm mb-4">
                Chatbot is private, to share or embed the chatbot change the visibility to public.
            </p>
            <div className="flex flex-col items-end justify-center">
                <MakePublicButton chatbotId={chatbotId} />
            </div>
        </div>
    )
}

export default MakePublicChatbot