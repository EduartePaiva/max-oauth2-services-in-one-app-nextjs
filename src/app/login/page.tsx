"use client";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import { BiLogoZoom } from "react-icons/bi";
import {
    FaDiscord,
    FaGithub,
    FaGoogle,
    FaReddit,
    FaSpotify,
    FaTwitch,
    FaYahoo,
} from "react-icons/fa";
import { TbBrandOauth } from "react-icons/tb";

import MyAnimeListIcon from "@/components/custom-icons/my-anime-list";
import RobloxIcon from "@/components/custom-icons/roblox";
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
                    <h1 className="text-lg font-bold">Login to a OAuth 2.0 Provider</h1>
                    <p className="text-balance text-[0.8125rem] text-muted-foreground">
                        Welcome back! Please chose a provider to continue!
                    </p>
                </div>

                <ProviderLoginBtn LogoIcon={FaGithub} name="Github" href="/login/github" />
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
                <ProviderLoginBtn
                    LogoIcon={MyAnimeListIcon}
                    name="MyAnimeList"
                    href="/login/myanimelist"
                    className="bg-[#2c51a2] hover:bg-[#2c51a2]/90"
                />
                <ProviderLoginBtn
                    LogoIcon={FaReddit}
                    name="Reddit"
                    href="/login/reddit"
                    className="bg-[#FF4500] hover:bg-[#FF4500]/90"
                />
                <ProviderLoginBtn
                    LogoIcon={RobloxIcon}
                    name="Roblox"
                    href="/login/roblox"
                    className="bg-[rgb(17,18,22)] hover:bg-[rgb(17,18,22)]/90"
                />
                <ProviderLoginBtn
                    LogoIcon={FaSpotify}
                    name="Spotify"
                    href="/login/spotify"
                    className="bg-[#1ED760] hover:bg-[#1ED760]/90"
                />
                <ProviderLoginBtn
                    LogoIcon={FaTwitch}
                    name="Twitch"
                    href="/login/twitch"
                    className="bg-[#9146FF] hover:bg-[#9146FF]/90"
                />
                <ProviderLoginBtn
                    LogoIcon={FaYahoo}
                    name="Yahoo"
                    href="/login/yahoo"
                    className="bg-[#410093] hover:bg-[#410093]/90"
                />
                <ProviderLoginBtn
                    LogoIcon={BiLogoZoom}
                    name="Zoom"
                    href="/login/zoom"
                    className="bg-[#2D8CFF] hover:bg-[#2D8CFF]/90"
                />
            </div>
        </>
    );
}
