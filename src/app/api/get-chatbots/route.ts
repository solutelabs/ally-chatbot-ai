import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";

export async function GET(req: Request) {

    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(ApiResponse(false, "Not authenticated"), { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(_user.id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$chatBots" },
            { $sort: { "chatBots.createdAt": -1 } },
            { $project: { "chatBots.chatBotId": 1, "chatBots.name": 1 } },
            { $group: { _id: "$_id", chatBots: { $push: "$chatBots" } } },
        ]).exec();

        if (!user) {
            return Response.json(ApiResponse(false, "User not found"), { status: 404 });
        }

        if (user.length === 0) {
            return Response.json(ApiResponse(true, "Users chatbots"), { status: 200 });
        }

        return Response.json(ApiResponse(true, "User chatbots", user[0].chatBots), { status: 200 });
    } catch (error) {
        console.log("Error fetching chatbots", error);
        return Response.json(ApiResponse(false, "Failed to get user's chatbots"), { status: 500 });
    }

}