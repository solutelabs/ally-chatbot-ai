import mongoose, { Document, Schema } from "mongoose";

export interface FileData extends Document {
    fileId: string;
    fileName: string;
    fileSize: number;
}


export const FileSchema: Schema<FileData> = new Schema({
    fileId: { type: String, required: [true, "FileId is required"] },
    fileName: { type: String, required: [true, "FileName is required"] },
    fileSize: { type: Number, required: [true, "FileSize is required"] },
})


export interface ChatBot extends Document {
    name: string;
    chatBotId: string;
    visibility: string;
    assistantId: string;
    trainedAt: Date;
    createdAt: Date;
    gptModel: string;
    temperature: number;
    totalFileSize: number;
    vectorStoreId: string;
    files: FileData[];
}

export const ChatBotSchema: Schema<ChatBot> = new Schema({
    name: { type: String, required: [true, "Name is required"] },
    chatBotId: { type: String, required: [true, "ChatBotId is required"] },
    visibility: { type: String, required: [true, "Visibility is required"] },
    assistantId: { type: String, required: [true, "AssistantId is required"] },
    trainedAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    gptModel: { type: String, required: [true, "GPT Model is required"] },
    temperature: { type: Number, required: [true, "Temperature is required"] },
    totalFileSize: { type: Number, required: [true, "Total file size is required"] },
    vectorStoreId: { type: String, required: [true, "VectorStoreId is required"] },
    files: { type: [FileSchema], required: [true, "To create chatbot files are required"] },
})

export interface User extends Document {
    username: string;
    password: string;
    chatBots: ChatBot[];
}

export const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true, "Username is required"], unique: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    chatBots: { type: [ChatBotSchema], default: null },
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;