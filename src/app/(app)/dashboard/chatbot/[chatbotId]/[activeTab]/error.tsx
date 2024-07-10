'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
            <h2 className="text-center">{error.message}</h2>
            <Button
                className="mt-4 rounded-md px-4 py-2 text-sm text-white transition-colors"
                onClick={
                    () => reset()
                }
            >
                Try again
            </Button>
        </main>
    );
}