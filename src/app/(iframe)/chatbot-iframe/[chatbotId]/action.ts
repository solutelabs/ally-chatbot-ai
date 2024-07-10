import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

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

        return data[0];

    } catch (error) {
        console.log("Error fetching chatbot", error);
        return null;
    }
}