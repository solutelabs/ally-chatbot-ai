import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import getChatbot from "./action"
import { notFound } from "next/navigation"
import RetrainChatbot from "@/components/custom/chatbot-dashboard/RetrainChatbot"
import TabsTriggerChatbot from "@/components/custom/TabsTriggerChatbot"
import DashboardChatbot from "@/components/custom/chatbot-dashboard/DashboardChatbot"
import SettingsChatbot from "@/components/custom/chatbot-dashboard/SettingsChatbot"
import ConnectChatbot from "@/components/custom/chatbot-dashboard/ConnectChatbot"

export interface chatbotType {
    name: string;
    chatBotId: string,
    visibility: string;
    trainedAt: string;
    createdAt: string;
    gptModel: string;
    temperature: number;
    totalFileSize: number;
}

export default async function Page({ params }: { params: { chatbotId: string, activeTab: string } }) {
    const chatbot: chatbotType = await getChatbot(params.chatbotId);

    const activeTab = params.activeTab;
    const chatbotId = params.chatbotId;

    if (!chatbot) {
        notFound();
    }

    return (
        <div className="mt-5 w-full" >
            <Tabs defaultValue={activeTab} className="w-full flex flex-col items-center justify-center">
                <TabsList>
                    <TabsTriggerChatbot chatbotId={chatbotId} />
                </TabsList>
                <TabsContent value="chatbot" >
                    <Card className="border-2 mt-5 mb-20 h-[100vh]">
                        <CardHeader>
                            <CardTitle className="text-center">{chatbot.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-start justify-center">
                            <DashboardChatbot chatbot={chatbot} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="sources">
                    <Card className="border-2 mt-5 mb-20">
                        <CardHeader>
                            <CardTitle>Data Sources</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-start justify-center w-[70vw]">
                            <RetrainChatbot chatbotId={chatbot.chatBotId} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="connect">
                    <Card className="border-2 mt-5 mb-20">
                        <CardHeader>
                            <CardTitle>Connect Chatbot</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-start justify-start w-[70vw]">
                            <ConnectChatbot chatbotId={chatbot.chatBotId} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings">
                    <SettingsChatbot chatbot={chatbot} />
                </TabsContent>
            </Tabs>
        </div>
    )
}