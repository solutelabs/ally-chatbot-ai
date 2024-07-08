import { cn } from "@/lib/utils";
import { Trash2 as RemoveIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const UploadedFileItem = ({ index, children, onDelete }: { index: number, children: React.ReactNode, onDelete: () => void }) => {
    return (
        <div
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-6 p-1 justify-between cursor-pointer relative",
            )}
        >
            <div className="font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full">
                {children}
            </div>
            <AlertDialog>
                <AlertDialogTrigger >
                    <RemoveIcon className="w-4 h-4 hover:stroke-destructive duration-200 ease-in-out" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            file and remove it from the chatbot.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};