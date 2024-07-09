"use client";

import { TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation";


const TabsTriggerChatbot = ({ chatbotId }: { chatbotId: string }) => {
    const router = useRouter();
    return (
        <>
            <TabsTrigger value="chatbot" onClick={() => {
                router.replace(`/dashboard/chatbot/${chatbotId}/chatbot`);
            }}>Chatbot</TabsTrigger>
            <TabsTrigger value="sources" onClick={() => {
                router.replace(`/dashboard/chatbot/${chatbotId}/sources`);
            }}>Sources</TabsTrigger>
            <TabsTrigger value="connect" onClick={() => {
                router.replace(`/dashboard/chatbot/${chatbotId}/connect`);
            }}>Connect</TabsTrigger>
            <TabsTrigger value="settings" onClick={() => {
                router.replace(`/dashboard/chatbot/${chatbotId}/settings`);
            }}>Settings</TabsTrigger>
        </>
    )
}

export default TabsTriggerChatbot