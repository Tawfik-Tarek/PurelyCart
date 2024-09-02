import {  CheckCircle2 } from "lucide-react";

export default function FormSuccess({ message }: { message?: string }) {
    if(!message) return null;
    return(
        <div className="bg-teal-400/40 my-4 text-secondary-foreground p-3 flex gap-2 items-center rounded-md">
            <CheckCircle2 className="w-4 h-4"/>
            <p>{message}</p>
        </div>
    )
}