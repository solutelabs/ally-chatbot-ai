"use client"

import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
    return (
        <Button variant={"outline"} onClick={() => signOut()}>{children}</Button>
    )
}

export default LogoutButton