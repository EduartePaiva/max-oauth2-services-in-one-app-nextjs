/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconType } from "react-icons/lib";

const RobloxIcon: IconType = ({
    children,
    size,
    //transparent fill
    color,
    title,
    ...props
}) => {
    return (
        <svg
            className="mx-3 align-middle text-white"
            width="36"
            height="36"
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M6.78817 0.975342L3.21606 14.3004L12.3069 16.7337L13.4424 12.4994L29.5881 16.8264L32.0247 7.73884L6.78817 0.975342Z"
                fill="currentColor"
            ></path>
            <path
                d="M18.6069 21.448L2.46124 17.1211L0.0246582 26.2119L25.2611 32.9754L28.8332 19.6504L19.7424 17.2138L18.6069 21.448Z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

export default RobloxIcon;
