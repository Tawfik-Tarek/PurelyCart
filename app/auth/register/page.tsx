import RegisterForm from "@/components/auth/register-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Register() {
  const user = await auth()
  if (user?.user) {
    return redirect("/");
  }
  return <RegisterForm />;
}
