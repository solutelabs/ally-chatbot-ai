import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { getChatbots } from './action';
import ChatbotCard from '@/components/component/chatbot-card';
import ChatbotsSkeleton from '@/components/skeletons/ChatbotsSkeleton';

export interface Chatbot {
    chatBotId: string;
    name: string;
    visibility: string;
}

// const chatbots: Chatbot[] = [
//     { chatBotId: "1", name: "Chatbot 1", visibility: "public" },
//     { chatBotId: "2", name: "Chatbot 2", visibility: "private" },
//     { chatBotId: "3", name: "Chatbot 3", visibility: "public" },
//     { chatBotId: "4", name: "Chatbot 4", visibility: "private" },
//     { chatBotId: "5", name: "Chatbot 5", visibility: "public" },
//     { chatBotId: "6", name: "Chatbot 6", visibility: "private" },
//     { chatBotId: "7", name: "Chatbot 7", visibility: "public" },
//     { chatBotId: "8", name: "Chatbot 8", visibility: "private" },
//     { chatBotId: "9", name: "Chatbot 9", visibility: "public" },
//     { chatBotId: "10", name: "Chatbot 10", visibility: "private" },
// ]

export default async function Dashboard() {

    const chatbots = await getChatbots();

    return (
        <div className='flex flex-col items-center w-full'>
            <div className="flex flex-row items-center justify-between w-3/4 mt-10">
                <h1 className='text-4xl font-bold'>Chatbots</h1>
                <Link href={"/dashboard/create-chatbot"}>
                    <Button className='bg-black'>Create Chatbot</Button>
                </Link>
            </div>
            <Suspense fallback={<ChatbotsSkeleton />}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-3/4 mt-10">
                    {chatbots.length === 0 && <h1 className='text-xl mt-10'>No chatbots found</h1>}
                    {chatbots.length !== 0 && chatbots.map((chatbot: Chatbot) => <ChatbotCard key={chatbot.chatBotId} chatbot={chatbot} />)}
                </div>
            </Suspense>
        </div>
    )
}