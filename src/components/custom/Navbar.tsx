import { User, getServerSession } from 'next-auth';
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
import LogoutButton from './LogoutButton';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function Navbar() {

    const session = await getServerSession(authOptions);

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
                            <DropdownMenuItem className='cursor-pointer'>
                                Create ChatBot
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='cursor-pointer'>
                            <LogoutButton>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </LogoutButton>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>

    )
}