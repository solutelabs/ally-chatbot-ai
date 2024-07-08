import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import getChatbot from "./action"
import { notFound } from "next/navigation"
import CopyToClipboard from "@/components/custom/CopyToClipboard"
import convertToMB from "@/lib/convertToMB"
import RetrainChatbot from "@/components/custom/RetrainChatbot"

export interface chatbot {
    name: string;
    chatBotId: string,
    visibility: string;
    trainedAt: string;
    createdAt: string;
    gptModel: string;
    temperature: number;
    totalFileSize: number;
}

export default async function Page({ params }: { params: { chatbotId: string } }) {
    const chatbot: chatbot = await getChatbot(params.chatbotId);

    if (!chatbot) {
        notFound();
    }

    return (
        <div className="mt-2 w-full" >
            <Tabs defaultValue="chatbot" className="w-full flex flex-col items-center justify-center">
                <TabsList>
                    <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
                    <TabsTrigger value="sources">Sources</TabsTrigger>
                    <TabsTrigger value="connect">Connect</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="chatbot" >
                    <Card className="">
                        <CardHeader>
                            <CardTitle>{chatbot.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-start justify-center">
                            <div className="w-[30vw]">
                                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                                    <Label htmlFor="chatbotId" className="text-bold text-gray-500">Chatbot ID</Label>
                                    <div className="flex flex-row items-center justify-center">
                                        <Label htmlFor="chatbotId">{chatbot.chatBotId}</Label>
                                        <CopyToClipboard text={chatbot.chatBotId} />
                                    </div>
                                </div>
                                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                                    <Label htmlFor="Model" className="text-bold text-gray-500">Model</Label>
                                    <Label htmlFor="Model">{chatbot.gptModel}</Label>
                                </div>
                                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                                    <Label htmlFor="visibility" className="text-bold text-gray-500">Visibility</Label>
                                    <Label htmlFor="visibility">{chatbot.visibility}</Label>
                                </div>
                                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                                    <Label htmlFor="Total File Size" className="text-bold text-gray-500">Total File Size</Label>
                                    <Label htmlFor="Total File Size">{convertToMB(chatbot.totalFileSize)} MB</Label>
                                </div>
                                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                                    <Label htmlFor="Temperature" className="text-bold text-gray-500">Temperature</Label>
                                    <Label htmlFor="Temperature">{chatbot.temperature}</Label>
                                </div>
                                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                                    <Label htmlFor="Trained At" className="text-bold text-gray-500">Trained At</Label>
                                    <Label htmlFor="Trained At">{chatbot.trainedAt.toString().split("T")[0]}</Label>
                                </div>
                                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                                    <Label htmlFor="Created At" className="text-bold text-gray-500">Created At</Label>
                                    <Label htmlFor="Created At">{chatbot.createdAt.toString().split("T")[0]}</Label>
                                </div>
                            </div>
                            <div className="w-[40vw] border h-[70vh]">
                                iframe
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="sources">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Data Sources</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-start justify-center w-[60vw]">
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
                    <div className="flex flex-col items-center justify-center min-h-[70vh]">
                        <h1 className="text-5xl font-bold mb-5">ALLY</h1>
                        <h1 className="text-2xl font-bold mb-5">Ai Assistant ChatBot</h1>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}