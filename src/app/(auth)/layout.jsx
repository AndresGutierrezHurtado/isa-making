"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Auth from "@/components/auth";

export default function AuthLayout({ children }) {
    const session = useSession();

    if (session.status === "authenticated") return <Auth type="authorized" />;
    return <>{children}</>;
}
