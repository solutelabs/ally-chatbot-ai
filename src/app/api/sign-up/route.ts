import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, password } = await request.json();
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return Response.json({
                success: false,
                message: "User already exists"
            }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ username, password: hashedPassword });
        return Response.json({
            success: true,
            message: "User registered successfully"
        }, { status: 201 })
    } catch (error) {
        console.error("Error in registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 })
    }
}