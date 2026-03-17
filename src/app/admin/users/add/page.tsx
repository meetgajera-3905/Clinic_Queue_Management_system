"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import api from "@/services/api";
import type { Metadata } from "next";
import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";

export default function AddUser() {
const router = useRouter();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [role, setRole] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = async() => {
    try{
        const res = await api.post("/admin/users",{
            name,
            email,
            password,
            role,
            phone,
        });
        alert("User added successfully");
        router.back();
    } catch(err){
        alert("Error adding user");
    };
  return (
    <>
    <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Add User" />

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
                <input
                    type="text"
                    placeholder="Name"
                    onChange={(e)=>{setName(e.target.value)}}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e)=>{setEmail(e.target.value)}}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e)=>{setPassword(e.target.value)}}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                    type="text"
                    placeholder="Role"
                    onChange={(e)=>{setRole(e.target.value)}}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                 <input
                    type="text"
                    placeholder="Phone"
                    onChange={(e)=>{setPhone(e.target.value)}}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />

            </div>

            <button onClick={handleSubmit} className="text-green-500 hover:text-green-700 border border-green-500 hover:border-green-700 rounded px-2 py-1">
              Add User
            </button>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
}
