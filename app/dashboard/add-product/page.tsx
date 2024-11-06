import { redirect } from "next/navigation";
import AddProductCard from "./add-prodct-card";
import { auth } from "@/server/auth";

export default async function AddProduct() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return redirect("/");
  }

  return (
    <AddProductCard />
  )
}
