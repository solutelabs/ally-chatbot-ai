import { Label } from "@/components/ui/label"
import CopyToClipboard from "@/components/custom/CopyToClipboard"
import convertToMB from "@/lib/convertToMB"
import { chatbotType } from "@/app/(app)/dashboard/chatbot/[chatbotId]/[activeTab]/page";
import { convertTemperature } from "@/lib/utils";


const DashboardChatbot = ({ chatbot }: { chatbot: chatbotType }) => {
    return (
        <>
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
                    <Label htmlFor="Temperature">{convertTemperature(chatbot.temperature)}</Label>
                </div>
                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                    <Label htmlFor="Trained At" className="text-bold text-gray-500">Last Trained At</Label>
                    <Label htmlFor="Trained At">{chatbot.trainedAt.toString().split("Z")[0].split("GMT+0530")[0]}</Label>
                </div>
                <div className="space-y-1 flex flex-col items-start justify-start mb-4">
                    <Label htmlFor="Created At" className="text-bold text-gray-500">Created At</Label>
                    <Label htmlFor="Created At">{chatbot.createdAt.toString().split("Z")[0].split("GMT+0530")[0]}</Label>
                </div>
            </div>
            <div className="w-[40vw] border h-[70vh]">
                iframe
            </div>
        </>
    )
}

export default DashboardChatbot