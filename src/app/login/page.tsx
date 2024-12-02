"use client";

import Link from "next/link";
import { useTransition } from "react";

import { ChevronLeft, Webhook } from "lucide-react";

import Spinner from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [isLogin] = useTransition();
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
                    <Webhook size={28} />
                    <h1 className="text-lg font-bold">
                        Login to some Provider
                    </h1>
                    <p className="text-muted-foreground text-balance text-[0.8125rem]">
                        Welcome back! Please chose a provider to continue!
                    </p>
                </div>

                <Button type="submit">
                    {isLogin ? (
                        <span className="">
                            <Spinner className="stroke-slate-300" />
                        </span>
                    ) : (
                        <span>Login</span>
                    )}
                </Button>
            </div>
        </>
    );
}
