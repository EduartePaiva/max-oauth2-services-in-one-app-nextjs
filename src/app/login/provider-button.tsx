import { MouseEvent } from "react";

import { IconType } from "react-icons/lib";

import Spinner from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";

type ProviderLoginBtn = {
    isLogin: boolean;
    LogoIcon: IconType;
    name: string;
    onClick?: (
        event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => void;
};

export default function ProviderLoginBtn({
    isLogin,
    LogoIcon,
    name,
    onClick,
}: ProviderLoginBtn) {
    return (
        <Button
            className="items-center"
            type="submit"
            disabled={isLogin}
            size={"lg"}
            onClick={onClick}
        >
            <span className="flex items-center gap-2">
                {isLogin ? (
                    <>
                        Logging in ...
                        <Spinner className="stroke-slate-300" />
                    </>
                ) : (
                    `Login With ${name}`
                )}
            </span>
            <LogoIcon
                style={{
                    width: "1.5em",
                    height: "1.5em",
                }}
            />
        </Button>
    );
}
