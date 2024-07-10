import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel, { ChatBot } from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ChatbotSettings } from "@/components/custom/chatbot-dashboard/SettingsChatbot";
import { convertTemperature } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: { chatbotId: string } }) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(ApiResponse(false, "Not authenticated"), { status: 401 });
    }

    const data: ChatbotSettings = await req.json();
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

        const trimmedTemperature = convertTemperature(data.temperature[0]);

        const assistantUpdateResponse = await openai.beta.assistants.update(
            chatbot.assistantId,
            {
                name: data.name,
                model: data.gptModel,
                temperature: trimmedTemperature,
            }
        );

        chatbot.name = data.name;
        chatbot.gptModel = data.gptModel;
        chatbot.temperature = data.temperature[0];
        chatbot.visibility = data.visibility;
        await user.save();

        return Response.json(ApiResponse(true, "Chatbot created successfully"), { status: 201 });

    } catch (error) {
        console.log("Error creating chatbot", error);
        return Response.json(ApiResponse(false, "Failed to create chatbot", error), { status: 500 });
    }
}