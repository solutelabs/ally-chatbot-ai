"use client";

import { makePublic } from "@/app/(app)/dashboard/chatbot/[chatbotId]/[activeTab]/action";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MakePublicButton({ chatbotId }: { chatbotId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handler = async () => {
        setIsLoading(true);

        try {
            const response = await makePublic(chatbotId);
            if (response) {
                toast.success("Chatbot is public now");
            }
            else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handler}>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2" /> : ""}
                Make Public
            </Button>
        </form>
    )
}