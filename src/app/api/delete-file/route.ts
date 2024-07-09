import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import OpenAI from "openai";

export async function DELETE(req: Request) {

    const { chatbotId, fileId } = await req.json();

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(ApiResponse(false, "Not authenticated"), { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.findOne(
            { _id: userId },
        );

        if (!user) {
            return Response.json(ApiResponse(false, "User not found"), { status: 404 });
        }

        const chatbot = user.chatBots.find((chatbot) => chatbot.chatBotId === chatbotId);

        if (!chatbot) {
            return Response.json(ApiResponse(false, "Chatbot not found"), { status: 404 });
        }

        const file = chatbot.files.find((file) => file.fileId === fileId);

        if (!file) {
            return Response.json(ApiResponse(false, "File not found"), { status: 404 });
        }

        const vectorStoreId = chatbot.vectorStoreId;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const openaiFileDeleteResult = await openai.files.del(fileId);
        const openaiFileRemoveFromVectorStoreResult = await openai.beta.vectorStores.files.del(vectorStoreId, fileId);

        if (openaiFileDeleteResult.deleted && openaiFileRemoveFromVectorStoreResult.deleted) {

            chatbot.totalFileSize -= file.fileSize;
            chatbot.files = chatbot.files.filter((file) => file.fileId !== fileId);

            await user.save();

            return Response.json(ApiResponse(true, "File deleted"), { status: 200 });
        }

        console.log("Failed to delete file in openai");
        console.log("openaiFileDeleteResult", openaiFileDeleteResult);
        console.log("openaiFileRemoveFromVectorStoreResult", openaiFileRemoveFromVectorStoreResult);
        return Response.json(ApiResponse(false, "Failed to delete file"), { status: 500 });
    } catch (error) {
        console.log("Error fetching chatbots", error);
        return Response.json(ApiResponse(false, "Failed to get user's chatbots"), { status: 500 });
    }
}