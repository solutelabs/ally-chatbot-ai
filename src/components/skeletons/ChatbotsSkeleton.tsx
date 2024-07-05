import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ChatbotsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-3/4 mt-10">
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            <Card className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center h-40 bg-secondary">
                    <Skeleton className="w-16 h-16" />
                    <Skeleton className="w-5 h-5 absolute top-2 right-2" />
                </div>
                <CardContent className="p-4 bg-background">
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>

        </div>
    )
}

export default ChatbotsSkeleton