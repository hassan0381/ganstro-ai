// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // server-side redirect, instantly takes user to /login
}
