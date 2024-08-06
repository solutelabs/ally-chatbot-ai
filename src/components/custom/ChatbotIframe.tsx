'use client';

import { Message, useAssistant } from 'ai/react';
import { RefreshCcw, SendHorizontalIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button"
import { MessageCard, MessageCardSkeleton } from '@/components/custom/MessageCard';

export default function ChatbotIframe({ chatbotId }: { chatbotId: string }) {

    const divRef = useRef<HTMLDivElement | null>(null);

    const { error, status, messages, input, submitMessage, handleInputChange, setMessages, setThreadId, threadId, stop } =
        useAssistant({
            api: `/api/assistant/${chatbotId}`
        });


    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error]);

    useEffect(() => {
        const localThreadId = localStorage.getItem(`threadId${chatbotId}`);
        if (localThreadId) {
            setThreadId(localThreadId);
        }
        console.log(localStorage.getItem(`messages${chatbotId}`))
        if (localStorage.getItem(`messages${chatbotId}`) === null || localStorage.getItem(`messages${chatbotId}`) === '[]') {
            setMessages([{
                id: '1',
                role: 'assistant',
                content: 'Hello, how can I help you?'
            }]);
        } else {
            setMessages(JSON.parse(localStorage.getItem(`messages${chatbotId}`) || '[]'));
        }
    }, [])

    useEffect(() => {
        if (threadId) {
            localStorage.setItem(`threadId${chatbotId}`, threadId);
        }
    }, [threadId])

    useEffect(() => {
        if (messages) {
            localStorage.setItem(`messages${chatbotId}`, JSON.stringify(messages));
        }
        if (divRef.current) {
            divRef.current.scrollTop = divRef.current.scrollHeight;
        }
    }, [messages])

    const handleKeyPress = (event: { key: string; shiftKey: any; preventDefault: () => void; }) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default action of adding a new line
            handleOnSubmit();
        }
    };

    const handleOnSubmit = () => {
        if (!input || input === '' || status !== "awaiting_message") return;
        submitMessage();
    }

    return (
        <div className='h-screen w-screen bg-white'>

            <div className="h-[6vh] border-b border-b-gray-300 flex justify-end items-center pr-5">
                <RefreshCcw className='w-5 h-5 cursor-pointer' onClick={() => {
                    stop();
                    localStorage.removeItem(`threadId${chatbotId}`);
                    localStorage.setItem(`messages${chatbotId}`, JSON.stringify([
                        {
                            id: '1',
                            role: 'assistant',
                            content: 'Hello, how can I help you?'
                        }
                    ]));
                    setMessages([
                        {
                            id: '1',
                            role: 'assistant',
                            content: 'Hello, how can I help you?'
                        }
                    ]);
                }} />
            </div>

            <div className='h-[calc(86vh-2px)] overflow-hidden overflow-y-auto text-white scroll-auto' ref={divRef}>
                {messages.map((m: Message) => (
                    <div key={m.id} className='flex flex-col space-y-2 pt-4 pb-4'>
                        {m.role === 'user' || m.role === 'assistant' ? <MessageCard message={m.content} role={m.role} status={status} /> : null}
                    </div>

                ))}
                {status === "in_progress" && messages[messages.length - 1].role === 'user' && <MessageCardSkeleton />}
            </div>

            {error ? <div>{error.message}</div> : null}

            <form onSubmit={handleOnSubmit} className='bg-white border-t-gray-300 border-t'>
                <div className="flex justify-center items-center">
                    <textarea
                        placeholder="Message ALLY"
                        className="overflow-hidden resize-none w-[100vw] h-[8vh]  pl-5 bg-white text-sm content-center rounded-none focus:outline-none"
                        onChange={handleInputChange}
                        value={input}
                        onKeyDown={handleKeyPress}
                    />
                    <Button type='submit' className='bg-white text-black h-[8vh] w-[8vh] rounded-none hover:bg-white focus:outline-none' disabled={status !== 'awaiting_message' || !input} >
                        <SendHorizontalIcon className='min-w-[4vh] min-h-[4vh]' />
                    </Button>
                </div>
            </form>
        </div>
    );
}