/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconType } from "react-icons/lib";

const MyAnimeListIcon: IconType = ({
    children,
    size,
    //transparent fill
    color = "#fff0",
    title,
    ...props
}) => {
    return (
        <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 940 940"
            {...props}
        >
            <rect
                className="stroke-0"
                width="940"
                height="940"
                rx="99.69"
                ry="99.69"
                style={{ fill: color }}
            />
            <path
                className="fill-white stroke-0"
                d="M360.18,640.05h-93.37v-215.38h-.85l-71.97,95.92-70.16-95.92h-.96v215.38H29.5v-356.23h88.57l75.91,104.66,77.61-104.66h88.58v356.23Z"
            />
            <path
                className="fill-white stroke-0"
                d="M667.97,640.05h-93.37v-112.96h-101.99c.5,36.48,12.42,74.14,35.77,112.96l-75.8,50.14c-11.5-17.25-21.42-35.61-29.76-55.09-8.34-19.48-14.71-39.57-19.11-60.26-4.4-20.69-6.6-41.26-6.6-61.7s2.31-42.21,6.92-62.76c4.61-20.55,11.71-40.12,21.29-58.72,9.58-18.59,21.58-35.1,35.98-49.51,15.83-15.97,32.77-28.19,50.84-36.68,18.06-8.48,36.89-14.21,56.48-17.19,19.59-2.98,42.09-4.47,67.5-4.47h45.78l21.83,80.27h-73.25c-30.38,0-54.35,4.36-71.92,13.08-17.57,8.72-29.85,18.47-36.84,29.24-6.99,10.77-13.65,24.24-19.96,40.4h92.84v-71.76h93.37v264.99Z"
            />
            <path
                className="fill-white stroke-0"
                d="M797.69,559.78h122.54l-21.83,80.28h-194.08v-356.23h93.37v275.96Z"
            />
        </svg>
    );
};

export default MyAnimeListIcon;
