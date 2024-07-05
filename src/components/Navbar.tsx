"use client"

import { User } from 'next-auth';
import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react';
import Link from 'next/link';



const Navbar = () => {

    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (

        <nav className='p-4 md:p-6 shadow-md bg-black'>
            <div className='container mx-auto flex flex-row justify-between items-center'>
                <Link className='text-xl font-bold mb-4 md:mb-0 text-white' href="/dashboard">ALLY</Link>
                <span className='text-white hidden sm:block'>Welcome, {user?.username}</span>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarFallback>{user?.username?.[0].toUpperCase() ?? ""}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className='text-lg text-center'>{user?.username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/dashboard/create-chatbot">
                            <DropdownMenuItem>
                                Create ChatBot
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()} className='cursor-pointer'>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>

    )
}

export default Navbar