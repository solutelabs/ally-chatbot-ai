import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import getChatbot from "./action"
import { notFound } from "next/navigation"
import RetrainChatbot from "@/components/custom/RetrainChatbot"
import TabsTriggerChatbot from "@/components/custom/TabsTriggerChatbot"
import DashboardChatbot from "@/components/custom/DashboardChatbot"
import SettingsChatbot from "@/components/custom/SettingsChatbot"

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
                    <Card className="border-2 mt-5 mb-20">
                        <CardHeader>
                            <CardTitle>{chatbot.name}</CardTitle>
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
                    <div className="flex flex-col items-center justify-center min-h-[70vh]">
                        <h1 className="text-5xl font-bold mb-5">ALLY</h1>
                        <h1 className="text-2xl font-bold mb-5">Ai Assistant ChatBot</h1>
                    </div>
                </TabsContent>
                <TabsContent value="settings">
                    <SettingsChatbot chatbot={chatbot} />
                </TabsContent>
            </Tabs>
        </div>
    )
}