"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/dist/client/components/navigation";
import api from "@/services/api";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const res = await api.post("/auth/login",{
            email: data.email,
            password: data.password,
        });
        console.log(res.data);
        const token = res.data.token;
        const name = res.data.user.name;
        const email = res.data.user.email;
        const role = res.data.user.role;
        const clinicId = res.data.user.id;
        const clinicName = res.data.user.clinicName;
        const clinicCode = res.data.user.clinicCode;

        localStorage.setItem("token",token)
        localStorage.setItem("role",role);
        localStorage.setItem("name",name);
        localStorage.setItem("email",email);
        localStorage.setItem("clinicId",clinicId);
        localStorage.setItem("clinicName",clinicName);
        localStorage.setItem("clinicCode",clinicCode);
        

        if(role === "admin") router.push("/admin");
        else router.push("/auth");

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
