"use server";

import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function getChatbots() {

    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return [];
    }
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {

        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$chatBots" },
            { $sort: { "chatBots.createdAt": -1 } },
            { $project: { "chatBots.chatBotId": 1, "chatBots.name": 1, "chatBots.visibility": 1 } },
            { $group: { _id: "$_id", chatBots: { $push: "$chatBots" } } },
        ]).exec();

        if (user.length === 0) {
            return [];
        }

        return user[0].chatBots;
    } catch (error) {
        console.log("Error fetching chatbots", error);
        return [];
    }

}