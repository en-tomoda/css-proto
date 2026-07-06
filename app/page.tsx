"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export default function Home() {
  const { role, onboarded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!role) router.replace("/login");
    else if (role === "admin") router.replace("/admin");
    else if (role === "member" && !onboarded) router.replace("/onboarding");
    else router.replace("/mypage");
  }, [role, onboarded, router]);

  return null;
}
