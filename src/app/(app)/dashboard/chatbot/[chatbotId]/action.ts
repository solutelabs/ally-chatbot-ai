"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import mongoose from "mongoose";
import UserModel from "@/models/User";

export default async function getChatbot(chatbotId: string) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        throw new Error("Unauthorized")
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const chatbot = await UserModel.aggregate([
            {
                $match: {
                    _id: userId,
                }
            },
            { $unwind: "$chatBots" },
            {
                $match: {
                    "chatBots.chatBotId": chatbotId
                }
            },
            {
                $project: {
                    "chatBots.chatBotId": 1,
                    "chatBots.name": 1,
                    "chatBots.visibility": 1,
                    "chatBots.trainedAt": 1,
                    "chatBots.createdAt": 1,
                    "chatBots.gptModel": 1,
                    "chatBots.temperature": 1,
                    "chatBots.numberOfCharacters": 1
                }
            }
        ]).exec();

        if (chatbot.length === 0) {
            return null;
        }

        return chatbot[0].chatBots;
    } catch (error) {
        console.log("Error fetching chatbot", error);
        throw new Error("Internal Server Error")
    }
}