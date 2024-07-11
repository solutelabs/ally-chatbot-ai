import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { revalidatePath } from "next/cache";

export async function getChatbot(chatbotId: string) {
    await dbConnect();

    try {
        const data = await UserModel.aggregate([
            { $unwind: "$chatBots" },
            { $match: { "chatBots.chatBotId": chatbotId } }
        ])

        if (data.length === 0) {
            return null;
        }

        revalidatePath(`/dashboard/chatbot/${chatbotId}/connect`);
        return data[0];

    } catch (error) {
        console.log("Error fetching chatbot", error);
        return null;
    }
}