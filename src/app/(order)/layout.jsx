"use client";

import React from "react";
import { useSession } from "next-auth/react";

// Components
import Auth from "@/components/auth";

export default function OrderLayout({ children }) {
    const session = useSession();
    if (session.status === "unauthenticated") return <Auth />;
    return <>{children}</>;
}
