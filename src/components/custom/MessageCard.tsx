import clsx from "clsx"
import { Skeleton } from "../ui/skeleton"


export function MessageCard({ message, role }: { message: string, role: 'user' | 'assistant' }) {
    return (
        <div className={clsx("flex w-[calc(100vw-8px)] pr-4 pl-4", role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={clsx("max-w-[350px] border-none p-3 rounded-2xl", role === 'user' ? 'bg-gray-800 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none')}>
                {message}
            </div>
        </div>
    )
}

export function MessageCardSkeleton() {
    return (
        <div className="flex w-[calc(100vw-8px)] pr-4 pl-4">
            <div className="max-w-[350px] border-none p-3 rounded-2xl rounded-bl-none">
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[350px] mt-1" />
                <Skeleton className="h-4 w-[350px] mt-1" />
            </div>
        </div>
    )
}