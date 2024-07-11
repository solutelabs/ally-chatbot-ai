import { notFound } from "next/navigation";
import { getChatbot } from "./action";
import ChatbotIframe from "@/components/custom/ChatbotIframe";
import { User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function Iframe({ params }: { params: { chatbotId: string } }) {

    const session = await getServerSession(authOptions)
    const _user: User = session?.user as User;

    const chatbotId = params.chatbotId;
    const chatbot = await getChatbot(chatbotId);

    if ((!chatbot || chatbot.chatBots.visibility === "private") && _user?._id !== chatbot?._id?.toString()) {
        notFound();
    }

    return <ChatbotIframe chatbotId={chatbotId} />
}