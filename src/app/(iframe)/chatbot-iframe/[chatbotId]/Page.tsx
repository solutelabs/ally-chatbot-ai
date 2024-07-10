import React from 'react'

export default function Page({ params }: { params: { chatbotId: string } }) {
    return (
        <div>
            <h1>{params.chatbotId}</h1>
        </div>
    )
}