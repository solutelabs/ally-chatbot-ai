import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/custom/Navbar';

export default function NotFound() {
    return (
        <main className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-2">
            <FaceFrownIcon className="w-10 text-gray-400" />
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>Could not find the requested route.</p>
            <Link
                href="/dashboard"
                className="mt-4 rounded-md  px-4 py-2 text-sm text-white transition-colors bg-black hover:bg-gray-800"
            >
                Go Back
            </Link>
        </main>
    );
}