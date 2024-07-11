import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { getChatbots } from './action';
import ChatbotCard from '@/components/custom/ChatbotCard';
import ChatbotsSkeleton from '@/components/skeletons/ChatbotsSkeleton';

export interface Chatbot {
    chatBotId: string;
    name: string;
    visibility: string;
}

export default async function Page() {

    const chatbots = await getChatbots();

    return (
        <div className='flex flex-col items-center w-full' >
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