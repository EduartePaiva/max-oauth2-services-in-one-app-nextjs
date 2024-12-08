import { IconType } from "react-icons/lib";

import { buttonVariants } from "@/components/ui/button";

type ProviderLoginBtn = {
    LogoIcon: IconType;
    name: string;
    href: string;
    className?: string;
};

export default function ProviderLoginBtn({
    LogoIcon,
    name,
    href,
    className,
}: ProviderLoginBtn) {
    return (
        <a
            className={buttonVariants({ size: "lg", className })}
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
        </a>
    );
}
