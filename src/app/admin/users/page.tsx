"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { getTopProducts } from "@/components/Tables/fetch";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response = await api.get("/admin/users");
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Users
        </h2>
        <button onClick={() => router.push("/admin/users/add")} className="text-green-500 hover:text-green-700 border border-green-500 hover:border-green-700 rounded px-2 py-1">
          Add User
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Phone
            </TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={user.id}
            >

              <TableCell>{user.name}</TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell>{user.role}</TableCell>

              <TableCell className="pr-5 text-right text-green-light-1 sm:pr-6 xl:pr-7.5">
                {user.phone}
              </TableCell>

              <TableCell>
                {user.createdAt}
              </TableCell>

              <TableCell>
                <button className="text-blue-500 hover:text-blue-700 border border-blue-500 hover:border-blue-700 rounded px-2 py-1">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700 ml-2 border border-red-500 hover:border-red-700 rounded px-2 py-1">
                  Delete
                </button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
