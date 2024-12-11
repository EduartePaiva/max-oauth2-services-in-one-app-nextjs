"use client";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { TbBrandOauth } from "react-icons/tb";

import { Button } from "@/components/ui/button";

import ProviderLoginBtn from "./provider-button";

export default function LoginPage() {
    return (
        <>
            <Link href={"/"} className="relative self-start">
                <Button
                    variant={"ghost"}
                    className="mt-4 gap-2 rounded-full text-base font-semibold"
                >
                    <ChevronLeft size={14} /> Home
                </Button>
            </Link>
            <div className="absolute left-1/2 top-1/2 flex w-[360px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-gray-50 p-6 shadow-md">
                <div className="mb-2 flex flex-col items-center text-center text-gray-700">
                    <TbBrandOauth size={28} />
                    <h1 className="text-lg font-bold">
                        Login to a OAuth 2.0 Provider
                    </h1>
                    <p className="text-balance text-[0.8125rem] text-muted-foreground">
                        Welcome back! Please chose a provider to continue!
                    </p>
                </div>

                <ProviderLoginBtn
                    LogoIcon={FaGithub}
                    name="Github"
                    href="/login/github"
                />
                <ProviderLoginBtn
                    LogoIcon={FaGoogle}
                    name="Google"
                    href="/login/google"
                    className="bg-[#db4639] hover:bg-[#db4639]/90"
                />
                <ProviderLoginBtn
                    LogoIcon={FaDiscord}
                    name="Discord"
                    href="/login/discord"
                    className="bg-[#7289d9] hover:bg-[#7289d9]/90"
                />
            </div>
        </>
    );
}
