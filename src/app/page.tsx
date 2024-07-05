import { Button } from "@/components/ui/button"
import Link from "next/link";


const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl font-bold mb-5">ALLY</h1>
            <h1 className="text-2xl font-bold mb-5">Ai Assistant ChatBot</h1>
            <Link href="/sign-up">
                <Button className="text-lg bg-black">Build your own</Button>
            </Link>
        </div>
    );
}

export default Home;