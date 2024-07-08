import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";

export async function GET(req: Request, { params }: { params: { chatbotId: string } }) {

    const chatbotId = params.chatbotId;

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(ApiResponse(false, "Not authenticated"), { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const files = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$chatBots" },
            { $match: { "chatBots.chatBotId": chatbotId } },
            { $project: { "chatBots.files": 1 } },
        ]).exec();

        if (!files) {
            return Response.json(ApiResponse(false, "User not found"), { status: 404 });
        }

        if (files.length === 0) {
            return Response.json(ApiResponse(true, "Files"), { status: 200 });
        }

        return Response.json(ApiResponse(true, "Files", files[0].chatBots.files), { status: 200 });
    } catch (error) {
        console.log("Error fetching chatbots", error);
        return Response.json(ApiResponse(false, "Failed to get user's chatbots"), { status: 500 });
    }

}