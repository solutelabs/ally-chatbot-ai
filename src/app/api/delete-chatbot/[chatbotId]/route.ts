import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel, { ChatBot } from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

export async function DELETE(req: NextRequest, { params }: { params: { chatbotId: string } }) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(ApiResponse(false, "Not authenticated"), { status: 401 });
    }

    const username = _user.username;
    const chatbotId = params.chatbotId;

    try {

        // find user if not found give error
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(ApiResponse(false, "User not found"), { status: 404 });
        }

        const chatbot: ChatBot | undefined = user.chatBots.find(chatbot => chatbot.chatBotId === chatbotId);

        if (!chatbot) {
            return Response.json(ApiResponse(false, "Chatbot not found"), { status: 404 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const files = chatbot.files;
        const assistantId = chatbot.assistantId;
        const vectorStoreId = chatbot.vectorStoreId;

        // create promises for deletion
        const fileDeletionPromises = files.map(file => openai.files.del(file.fileId));
        const assistantDeletionPromise = openai.beta.assistants.del(assistantId);
        const vectorStoreDeletionPromise = openai.beta.vectorStores.del(vectorStoreId);

        // Run all deletion promises in parallel
        await Promise.all([
            ...fileDeletionPromises,
            assistantDeletionPromise,
            vectorStoreDeletionPromise
        ]);

        // delete chatbot
        user.chatBots = user.chatBots.filter(chatbot => chatbot.chatBotId !== chatbotId);
        await user.save();

        revalidatePath("/dashboard");

        return Response.json(ApiResponse(true, "Chatbot deleted successfully"), { status: 200 });

    } catch (error) {
        console.log("Error creating chatbot", error);
        return Response.json(ApiResponse(false, "Failed to create chatbot", error), { status: 500 });
    }
}