"use client";

// import { signOut } from "next-auth/react";
import Link from "next/link";
export default function Logout() {
  return ( 
    <span><Link href="/api/auth/signout">Sign Out</Link></span>
  );
}
