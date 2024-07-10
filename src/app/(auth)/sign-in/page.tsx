"use client"

import { useToast } from '@/components/ui/use-toast'
import { singInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'


const SignInPage = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof singInSchema>>({
        resolver: zodResolver(singInSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof singInSchema>) => {
        setIsSubmitting(true);
        const response = await signIn("credentials", {
            username: data.username,
            password: data.password,
            redirect: false,
        });

        if (response?.error) {
            if (response.error === "CredentialsSignin") {
                toast({
                    title: "Invalid credentials",
                    description: "Invalid username or password",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Sign in failed",
                    description: response.error,
                    variant: "destructive"
                })
            }
        }

        setIsSubmitting(false);
        if (response?.ok) {
            router.replace("/dashboard");
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-black'>
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back
                    </h1>
                    <p className="mb-4">Sign in to continue to ally</p>
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
                                        <Input placeholder="email or username" {...field} />
                                    </FormControl>
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
                                ) : ("Sign In")
                            }
                        </Button>
                    </form>

                </Form>
                <div className="text-center mt-4">
                    <p>
                        New to Anonymous Feedback?{" "}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignInPage