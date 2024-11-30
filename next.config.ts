import type { NextConfig } from "next";
import { env as envClient } from "@/env/client";
import { env as envServer } from "@/env/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const envs = [envClient, envServer];

const nextConfig: NextConfig = {
    /* config options here */
};

export default nextConfig;
