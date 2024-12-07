"use client";

import { logout } from "@/actions/logout";

import { Button } from "./ui/button";

export default function LogoutBtn() {
    return (
        <Button onClick={logout} size={"lg"} className="text-lg font-semibold">
            Logout
        </Button>
    );
}
