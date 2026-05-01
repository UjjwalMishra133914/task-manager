"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Signup successful!");
      router.push("/login");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Card>
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        <Input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

        {/* Role Select */}
        <select
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <Button text="Signup" onClick={handleSignup} />

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}