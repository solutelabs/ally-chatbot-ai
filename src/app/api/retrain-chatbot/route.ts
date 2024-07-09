import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel, { FileData } from "@/models/User";
import { getISTDate, maxTotalFileSize } from "@/lib/utils";

export async function POST(req: NextRequest) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(ApiResponse(false, "Not authenticated"), { status: 401 });
    }


    const formData = await req.formData();

    const files = formData.getAll("files") as File[];
    const username = _user.username;
    const chatbotId = formData.get("chatbotId") as string;

    try {

        // find user if not found give error
        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json(ApiResponse(false, "User not found"), { status: 404 });
        }

        const chatbot = user.chatBots.find(chatbot => chatbot.chatBotId === chatbotId);

        if (!chatbot) {
            return Response.json(ApiResponse(false, "Chatbot not found"), { status: 404 });
        }

        // verifying number of characters in files
        let totalFileSize = chatbot.totalFileSize;

        for (const file of files) {
            totalFileSize += file.size;
        }


        if (totalFileSize > maxTotalFileSize) {
            return Response.json(ApiResponse(false, "Total file size exceeds the limit of 5MB"), { status: 400 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const vectorStoreId = chatbot.vectorStoreId;

        const responseOfFilesUpload = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
            vectorStoreId,
            { files }
        )

        const filesResponse = await openai.beta.vectorStores.files.list(vectorStoreId);
        const filesData = filesResponse.data;

        const fileIds = filesData.map(file => file.id);

        const filesWithInfo: FileData[] = await Promise.all(fileIds.map(async (fileId) => {
            const file = await openai.files.retrieve(fileId);

            return {
                fileId: file.id,
                fileName: file.filename,
                fileSize: file.bytes,
            } as FileData;
        }));

        chatbot.files = filesWithInfo;
        chatbot.trainedAt = getISTDate();
        chatbot.totalFileSize = totalFileSize;
        await user.save();

        return Response.json(ApiResponse(true, "Chatbot retrained successfully"), { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error retraining chatbot", error);
            return Response.json(ApiResponse(false, "Failed to retrain chatbot", error.message), { status: 500 });
        } else {
            console.log("Unknown error retraining chatbot", error);
            return Response.json(ApiResponse(false, "Failed to retrain chatbot", "Unknown error"), { status: 500 });
        }
    }
}