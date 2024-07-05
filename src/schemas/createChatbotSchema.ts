import { z } from "zod";

export const createChatbotSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});