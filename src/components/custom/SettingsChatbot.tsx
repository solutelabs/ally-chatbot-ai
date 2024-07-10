"use client"

import { chatbotType } from "@/app/(app)/dashboard/chatbot/[chatbotId]/[activeTab]/page";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CopyToClipboard from "./CopyToClipboard";
import * as z from "zod"
import { chatbotSettingsSchema } from "@/schemas/chatbotSettingsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 as RemoveIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type ChatbotSettings = z.infer<typeof chatbotSettingsSchema>;

interface DirtyFields {
    [key: string]: boolean;
}

const SettingsChatbot = ({ chatbot }: { chatbot: chatbotType }) => {

    const form = useForm<ChatbotSettings>({
        resolver: zodResolver(chatbotSettingsSchema),
        defaultValues: {
            name: chatbot.name,
            gptModel: chatbot.gptModel,
            temperature: [chatbot.temperature],
            visibility: chatbot.visibility,
        }
    })
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const onSubmit = async (data: ChatbotSettings) => {
        setIsLoading(true);

        // const dirtyFields = form.formState.dirtyFields;
        // const dataToSend: Partial<ChatbotSettings> = Object.keys(dirtyFields).reduce((acc: Partial<ChatbotSettings>, key) => {
        //     if (dirtyFields[key as keyof DirtyFields]) {
        //         acc[key as keyof ChatbotSettings] = data[key as keyof ChatbotSettings];
        //     }
        //     return acc;
        // }, {});
        // console.log(dataToSend)

        try {
            const response = await fetch(`/api/update-chatbot/${chatbot.chatBotId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to update chatbot");
            }
            toast.success("Chatbot updated successfully");
            router.replace(`/dashboard/chatbot/${chatbot.chatBotId}/chatbot`);
        } catch (error) {
            console.error('Error updating chatbot:', error);
            toast.error("Error updating chatbot")
        } finally {
            setIsLoading(false);
        }
    }

    const deleteChatbotHandler = async () => {

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/delete-chatbot/${chatbot.chatBotId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete chatbot");
            }
            toast.success("Chatbot deleted successfully");
            router.replace("/dashboard");
        } catch (error) {
            console.error('Error deleting chatbot:', error);
            toast.error("Error deleting chatbot")
        } finally {
            setIsDeleting(false);
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] border-2 w-[60vw] rounded-lg mt-5 mb-20">
            <Label className="text-3xl font-bold mt-5">Settings</Label>
            <div className="space-y-1 flex flex-col items-start justify-start mb-5 w-2/3 mt-10">
                <Label htmlFor="chatbotId" className="text-bold text-gray-500 mb-2">Chatbot ID</Label>
                <div className="flex flex-row items-center justify-center">
                    <Label htmlFor="chatbotId">{chatbot.chatBotId}</Label>
                    <CopyToClipboard text={chatbot.chatBotId} />
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 flex flex-col justify-center mb-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-bold text-gray-500">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter Chatbot Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="gptModel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-bold text-gray-500">Model</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                                        <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                                        <SelectItem value="gpt-4-turbo-preview">gpt-4-turbo-preview</SelectItem>
                                        <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <div className="flex flex-row justify-between w-full pr-3 text-bold text-gray-500">
                                        <p>Temperature: <span className="text-sm text-gray-600">{field.value[0] / 100}</span></p>
                                    </div>
                                </FormLabel>
                                <Slider onValueChange={field.onChange} defaultValue={field.value} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-bold text-gray-500">Visibility</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a privacy" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="private">private</SelectItem>
                                        <SelectItem value="public">public</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !form.formState.isDirty} className="w-1/4">
                                Save
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
            <div className="flex w-full flex-row justify-evenly items-center mt-5">
                <Separator className="w-[40%] h-[2px] bg-red-200" />
                <Label className="text-base font-bold text-red-600">DANGER ZONE</Label>
                <Separator className="w-[40%] h-[2px] bg-red-200" />
            </div>
            <div className="flex w-2/3 flex-row justify-between items-center mt-5 border border-red-200 rounded-lg p-5 m-6">
                <p className="font-medium text-sm w-[70%]">
                    Once you delete your chatbot, there is no going back. Please be certain.

                    All your uploaded data will be deleted. <span className="text-red-600 font-bold">This action is not reversible.</span>
                </p>
                <AlertDialog>
                    <AlertDialogTrigger disabled={isDeleting || isLoading}>
                        {isDeleting ?
                            <p className="flex flex-row items-center justify-center bg-red-300 hover:bg-red-400 text-white px-4 py-2 rounded-lg">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </p> :
                            <p className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                                Delete Chatbot
                            </p>
                        }
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                chatbot and all of its data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteChatbotHandler} className="bg-red-500 hover:bg-red-600 text-white" disabled={isDeleting}>
                                {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Delete Chatbot"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default SettingsChatbot