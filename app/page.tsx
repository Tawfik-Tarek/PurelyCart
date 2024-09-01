import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100dvh-1.25rem)]">
      <h3 className="mb-5">hi</h3>
      <Button variant={"destructive"}>Click me</Button>
    </main>
  );
}
