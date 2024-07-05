import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { BotIcon, LockIcon, GlobeIcon } from "../icons/Icons";

export interface ChatbotCardProps {
    chatbot: { chatBotId: string, name: string, visibility: string }
}

const ChatbotCard = ({ chatbot }: ChatbotCardProps) => {
    return (
        <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
            <Link href={"/chatbot/" + chatbot.chatBotId} className="absolute inset-0 z-10">
                <span className="sr-only">View Chatbot</span>
            </Link>
            <div className="flex items-center justify-center h-40 bg-secondary">
                <BotIcon className="w-16 h-16 text-secondary-foreground" />
                {chatbot.visibility === "private" && <LockIcon className="w-5 h-5 absolute top-2 right-2 text-primary-secondary" />}
                {chatbot.visibility === "public" && <GlobeIcon className="w-5 h-5 absolute top-2 right-2 text-primary-secondary" />}
            </div>
            <CardContent className="p-4 bg-background">
                <h3 className="text-lg font-semibold">{chatbot.name}</h3>
            </CardContent>
        </Card>
    )
}

export default ChatbotCard;