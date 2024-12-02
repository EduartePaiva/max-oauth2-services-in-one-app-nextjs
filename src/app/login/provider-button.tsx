import Link from "next/link";

import { IconType } from "react-icons/lib";

import { buttonVariants } from "@/components/ui/button";

type ProviderLoginBtn = {
    LogoIcon: IconType;
    name: string;
    href: string;
};

export default function ProviderLoginBtn({
    LogoIcon,
    name,
    href,
}: ProviderLoginBtn) {
    return (
        <Link
            className={buttonVariants({ size: "lg" })}
            type="submit"
            href={href}
        >
            <span className="flex items-center gap-2">Login With {name}</span>
            <LogoIcon
                style={{
                    width: "1.5em",
                    height: "1.5em",
                }}
            />
        </Link>
    );
}
