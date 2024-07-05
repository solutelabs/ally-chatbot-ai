import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel, { ChatBot } from "@/models/User";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(ApiResponse(false, "Not authenticated"), { status: 401 });
    }


    const formData = await req.formData();

    const files = formData.getAll("files") as File[];
    const vectorStoreName = formData.get("name") as string;
    const username = _user.username;
    const chatbotId = uuidv4();

    try {

        // find user if not found give error
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(ApiResponse(false, "User not found"), { status: 404 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const vectorStore = await openai.beta.vectorStores.create({
            name: vectorStoreName,
        });

        const responseOfFilesUpload = await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files });

        const assistantName = `${username}-${vectorStore.id}`;

        const assistant = await openai.beta.assistants.create({
            name: assistantName,
            instructions: "Use vector store to retrieve related information to users query and give proper responses. Do not give response more than 100 words.",
            model: "gpt-4o",
            tools: [{ type: "file_search" }],
            tool_resources: {
                file_search: {
                    vector_store_ids: [vectorStore.id],
                }
            }
        });

        const newChatbot = {
            name: vectorStoreName,
            chatBotId: chatbotId,
            visibility: "private",
            assistantId: assistant.id,
            trainedAt: new Date(),
            createdAt: new Date(),
            gptModel: "gpt-4o",
            temperature: 0.5,
            numberOfCharacters: 100,
            vectorStoreId: vectorStore.id,
        }

        user.chatBots.push(newChatbot as ChatBot);
        await user.save();

        return Response.json(ApiResponse(true, "Chatbot created successfully", newChatbot), { status: 201 });

    } catch (error) {
        console.log("Error creating chatbot", error);
        return Response.json(ApiResponse(false, "Failed to create chatbot", error), { status: 500 });
    }
}