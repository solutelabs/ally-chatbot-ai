import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { ApiResponse } from '@/types/ApiResponse';
import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {

    await dbConnect();
    const chatbotId = params.chatbotId;
    let assistantId = "";

    try {
        const data = await UserModel.aggregate([
            { $unwind: "$chatBots" },
            { $match: { "chatBots.chatBotId": chatbotId } },
            { $project: { "chatBots.assistantId": 1 } }
        ])

        assistantId = data[0].chatBots.assistantId;

    } catch (error) {
        console.log("Error fetching chatbot", error);
        return Response.json({ error: "Error fetching chatbot" }, { status: 500 });
    }

    // Parse the request body
    const input: {
        threadId: string | null;
        message: string;
    } = await req.json();

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
    });

    return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream, sendDataMessage }: { forwardStream: any, sendDataMessage: any }) => {
            // Run the assistant on the thread
            const runStream = openai.beta.threads.runs.stream(threadId, {
                assistant_id: assistantId
            });

            // forward run status would stream message deltas
            let runResult = await forwardStream(runStream);

            // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
            while (
                runResult?.status === 'requires_action' &&
                runResult.required_action?.type === 'submit_tool_outputs'
            ) {
                const tool_outputs =
                    runResult.required_action.submit_tool_outputs.tool_calls.map(
                        (toolCall: any) => {
                            const parameters = JSON.parse(toolCall.function.arguments);

                            switch (toolCall.function.name) {
                                // configure your tool calls here

                                default:
                                    throw new Error(
                                        `Unknown tool call function: ${toolCall.function.name}`,
                                    );
                            }
                        },
                    );

                runResult = await forwardStream(
                    openai.beta.threads.runs.submitToolOutputsStream(
                        threadId,
                        runResult.id,
                        { tool_outputs },
                    ),
                );
            }
        },
    );
}

export async function GET(req: Request, { params }: { params: { chatbotId: string } }) {
    await dbConnect();
    const chatbotId = params.chatbotId;

    try {
        const data = await UserModel.aggregate([
            { $unwind: "$chatBots" },
            { $match: { "chatBots.chatBotId": chatbotId } }
        ])

        if (data.length === 0) {
            return Response.json(ApiResponse(false, "Chatbot not found"), { status: 404 });
        }

        return Response.json(ApiResponse(true, "Assistant fetched successfully"), { status: 200 });

    } catch (error) {
        console.log("Error fetching chatbot", error);
        return Response.json(ApiResponse(false, "Error fetching chatbot"), { status: 500 });
    }
}