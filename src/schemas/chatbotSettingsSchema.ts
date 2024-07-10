import { z } from "zod"

export const chatbotSettingsSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    gptModel: z.string().min(1, { message: "Model is required" }),
    temperature: z.array(z.number()).min(1, { message: "Temperature is required" }),
    visibility: z.string().min(1, { message: "Visibility is required" }),
})