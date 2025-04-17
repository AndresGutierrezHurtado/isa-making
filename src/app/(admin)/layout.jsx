"use client";

import React from "react";
import { useSession } from "next-auth/react";

// Components
import Auth from "@/components/auth";

export default function AdminLayout({ children }) {
    const { status, data: session } = useSession();

    if (status === "unauthenticated") return <Auth />;
    if (session.user.role_id !== 2) return <Auth type="forbidden" />;

    return <>{children}</>;
}
