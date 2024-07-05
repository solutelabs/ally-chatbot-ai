import mongoose, { Document, Schema } from "mongoose";


export interface ChatBot extends Document {
    name: string;
    chatBotId: string;
    visibility: string;
    assistantId: string;
    trainedAt: Date;
    createdAt: Date;
    gptModel: string;
    temperature: number;
    numberOfCharacters: number;
    vectorStoreId: string;
}

export const ChatBotSchema: Schema<ChatBot> = new Schema({
    name: { type: String, required: [true, "Name is required"] },
    chatBotId: { type: String, required: [true, "ChatBotId is required"], unique: true },
    visibility: { type: String, required: [true, "Visibility is required"] },
    assistantId: { type: String, required: [true, "AssistantId is required"], unique: true },
    trainedAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    gptModel: { type: String, required: [true, "GPT Model is required"] },
    temperature: { type: Number, required: [true, "Temperature is required"] },
    numberOfCharacters: { type: Number, required: [true, "Number of characters is required"] },
    vectorStoreId: { type: String, required: [true, "VectorStoreId is required"], unique: true },
})

export interface User extends Document {
    username: string;
    password: string;
    chatBots: ChatBot[];
}

export const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true, "Username is required"], unique: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    chatBots: { type: [ChatBotSchema], default: [] },
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;