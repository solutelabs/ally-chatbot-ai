import clsx from "clsx"
import { Skeleton } from "../ui/skeleton"
import MarkdownRenderer from "./MarkdownRenderer";



export function MessageCard({ message, role, status }: { message: string, role: 'user' | 'assistant', status: 'awaiting_message' | 'in_progress' }) {
    return (
        <div className={clsx("flex w-[calc(100vw-8px)] pr-4 pl-4 chat", role === 'user' ? 'justify-end chat-end' : 'justify-start chat-start')}>
            <div className={clsx("max-w-[350px] border-none p-3 rounded-2xl chat-bubble", role === 'user' ? 'bg-gray-800 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none')}>
                <MarkdownRenderer markdownText={message} />
            </div>
        </div>
    )
}

export function MessageCardSkeleton() {
    return (
        <div className="flex w-[calc(100vw-8px)] mt-0">
            <div className={clsx("flex w-[calc(100vw-8px)] pr-4 pl-4 chat justify-start chat-start")}>
                <div className={clsx("max-w-[350px] border-none p-3 rounded-2xl chat-bubble bg-gray-200 text-black rounded-bl-none")}>
                    <Skeleton className="h-4 w-[320px]" />
                    <Skeleton className="h-4 w-[320px] mt-1" />
                    <Skeleton className="h-4 w-[250px] mt-1" />
                </div>
            </div>
        </div>
    )
}