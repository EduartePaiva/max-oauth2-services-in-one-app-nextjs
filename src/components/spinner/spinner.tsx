import { SVGProps } from "react";
import "./spinner-style.css";
import { cn } from "@/lib/utils";

export default function Spinner({
    width = 24,
    height = 24,
    className,
}: SVGProps<SVGElement>) {
    return (
        <svg
            width={width}
            height={height}
            stroke="#000"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g className={cn("spinner_V8m1", className)}>
                <circle
                    cx="12"
                    cy="12"
                    r="9.5"
                    fill="none"
                    strokeWidth="3"
                ></circle>
            </g>
        </svg>
    );
}
