import { notFound } from "next/navigation";
import { getChatbot } from "./action";
import ChatbotIframe from "@/components/custom/ChatbotIframe";

export default async function Iframe({ params }: { params: { chatbotId: string } }) {

    const chatbotId = params.chatbotId;
    const chatbot = await getChatbot(chatbotId);
    if (!chatbot) {
        notFound();
    }
    
    return <ChatbotIframe chatbotId={chatbotId} />
}