import { AlertCircle } from "lucide-react";

export default function FormError({ message }: { message?: string }) {
    if(!message) return null;
    return(
        <div className="bg-destructive my-4 text-secondary-foreground  p-3 flex gap-2 items-center rounded-md">
            <AlertCircle className="w-4 h-4"/>
            <p>{message}</p>
        </div>
    )
}
