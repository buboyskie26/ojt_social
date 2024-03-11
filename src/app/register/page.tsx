import { getServerSession } from "next-auth";
import RegisterForm from "../components/registerForm";
import { redirect } from "next/navigation";

export default async function RegisterPage() { 
  const session = await getServerSession();
  if(session) {
    redirect("/dashboard")
  }
  return (
    <RegisterForm />
  )
}
