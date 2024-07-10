"use client";

import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 500);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    useEffect(() => {
        const checkUniqueUsername = async () => {
            setIsCheckingUsername(true);
            setUsernameMessage("");
            try {
                const response = await axios.get<ApiResponse>(`/api/check-unique-username?username=${username}`);
                setUsernameMessage(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message || "Error checking username");
            } finally {
                setIsCheckingUsername(false);
            }
        }

        if (username) {
            checkUniqueUsername();
        }

    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            toast({
                title: "Success",
                description: response.data.message,
            })
            router.replace("/sign-in");
        } catch (error) {
            console.log("Error registering user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Error registering user";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-black'>
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-black">
                        Get your ALLY chatbot
                    </h1>
                    <p className="mb-4">Sign up to create your own chatbot</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                                debounced(e.target.value)
                                            }} />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4" />}
                                    {usernameMessage.length > 0 && <p className={`text-sm ${usernameMessage === "Username is unique." ?
                                        'text-green-500' :
                                        'text-red-500'}`} >
                                        {usernameMessage}
                                    </p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} className='w-full bg-black'>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : ("Sign Up")
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}