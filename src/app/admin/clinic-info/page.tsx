"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { useEffect, useState } from "react";
import { CameraIcon } from "../profile/_components/icons";
import Link from "next/link";
import api from "@/services/api";

export default function Page() {

// {
//     "id": 615,
//     "name": "Gajera Meet Rameshbhai Clinic",
//     "code": "CLINIC-615",
//     "createdAt": "2026-03-16T13:40:57.000Z",
//     "userCount": 1,
//     "appointmentCount": 0,
//     "queueCount": 0
// } 

  const [data, setData] = useState({
    id: 0,
    name: "",
    code: "",
    createdAt: "",
    userCount: 0,
    appointmentCount: 0,
    queueCount: 0,
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

  const clinicData = async() => {
    const res = await api.get("/admin/clinic");
    setData(res.data);
  }

  useEffect(() => {
    clinicData();
  }, []);
  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Info" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full text-3xl max-w-30 sm:h-44 sm:max-w-[176px] font-bold text-black sm:p-3">
            Clinic Information
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {localStorage.getItem("name")}
            </h3>
            <p className="font-medium">{localStorage.getItem("email")}</p>
            <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-rows-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
              
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="text-body-sm">ClinicId</span>
                <span className="font-medium text-dark dark:text-white">
                  {data.id}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="text-body-sm">ClinicName</span>
                <span className="font-medium text-dark dark:text-white">
                  {data.name}
                </span>
                
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="text-body-sm-sm">ClinicCode</span>
                <span className="font-medium text-dark dark:text-white">
                  {data.code}
                </span>
                
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="text-body-sm-sm">createdAt</span>
                <span className="font-medium text-dark dark:text-white">
                  {data.createdAt}
                </span>
                
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="text-body-sm-sm">UserCount</span>
                <span className="font-medium text-dark dark:text-white">
                  {data.userCount}
                </span>
                
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="text-body-sm-sm">AppointmentCount</span>
                <span className="font-medium text-dark dark:text-white">
                  {data.appointmentCount}
                </span>
                
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="text-body-sm-sm">QueueCount</span>
                <span className="font-medium text-dark dark:text-white">
                  {data.queueCount}
                </span>
                
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
