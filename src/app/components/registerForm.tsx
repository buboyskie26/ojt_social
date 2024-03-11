"use client";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        birthday: formData.get("birthday"),
        password: formData.get("password"),
        redirect: false,
      }),
    });
    console.log({ response });
    if (response.ok) {
      router.push("/");
      router.refresh();
    } else {
      console.error("Registration failed");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="email" required />
      <input type="text" name="firstName" placeholder="firstName" required />
      <input type="text" name="lastName" placeholder="lastName" required />
      <input type="date" name="birthday" placeholder="birthday" required />
      <input type="password" name="password" placeholder="password" required />
      <button type="submit">Register</button>
    </form>
  );
}
