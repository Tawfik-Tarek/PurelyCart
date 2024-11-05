import LoginForm from "@/components/auth/login-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const user = await auth()
  if (user?.user) {
    return redirect("/");
  }
  return <LoginForm />;
}