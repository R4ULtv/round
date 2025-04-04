import type { SVGProps } from "react";
import { priorityEnum, statusEnum } from "@/auth-schema";

type PriorityIconProps = SVGProps<SVGSVGElement> & {
  priority: (typeof priorityEnum.enumValues)[number];
};

type StatusIconProps = SVGProps<SVGSVGElement> & {
  status: (typeof statusEnum.enumValues)[number];
};

export const RoundIcon = ({ ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    aria-label="Round Icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 500 500"
    {...props}
  >
    <path
      fill="#8299ff"
      d="M250,0C111.93,0,0,111.93,0,250s111.93,250,250,250,250-111.93,250-250S388.07,0,250,0ZM250,450c-110.46,0-200-89.54-200-200S139.54,50,250,50s200,89.54,200,200-89.54,200-200,200Z"
    />
    <circle fill="#8299ff" cx="250" cy="250" r="150" />
  </svg>
);

export const PriorityIcon = ({ priority, ...props }: PriorityIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-label={priority}
    {...props}
  >
    {priority === "no_priority" ? (
      <>
        <rect x="1.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
        <rect x="6.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
        <rect x="11.5" y="7.25" width="3" height="1.5" rx="0.5" opacity="0.9" />
      </>
    ) : priority === "urgent" ? (
      <path
        fill="lch(66% 80 48)"
        d="M3 1C1.91067 1 1 1.91067 1 3V13C1 14.0893 1.91067 15 3 15H13C14.0893 15 15 14.0893 15 13V3C15 1.91067 14.0893 1 13 1H3ZM7 4L9 4L8.75391 8.99836H7.25L7 4ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z"
      ></path>
    ) : (
      <>
        <rect
          x="11.5"
          y="2"
          width="3"
          height="12"
          rx="1.5"
          fillOpacity={priority === "high" ? 1 : 0.5}
        />
        <rect
          x="6.5"
          y="5"
          width="3"
          height="9"
          rx="1.5"
          fillOpacity={priority === "medium" || priority === "high" ? 1 : 0.5}
        />
        <rect x="1.5" y="8" width="3" height="6" rx="1.5" />
      </>
    )}
  </svg>
);
export const StatusIcon = ({ status, ...props }: StatusIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    fill="none"
    aria-label={status}
    {...props}
  >
    {status === "backlog" && (
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="lch(78.25% 3.58 260.65)"
        strokeWidth="1.5"
        strokeDasharray="1.4 1.74"
        strokeDashoffset="0.65"
      />
    )}
    {status === "todo" && (
      <rect
        x="1"
        y="1"
        width="12"
        height="12"
        rx="6"
        stroke="lch(89% 0 0)"
        strokeWidth="1.5"
        fill="none"
      />
    )}
    {status === "in_progress" && (
      <>
        <rect
          x="1"
          y="1"
          width="12"
          height="12"
          rx="6"
          stroke="lch(80% 90 85)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          fill="lch(80% 90 85)"
          stroke="none"
          d="M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 3.5, 7 z"
          transform="translate(3.5,3.5)"
        />
      </>
    )}
    {status === "review" && (
      <>
        <rect
          x="1"
          y="1"
          width="12"
          height="12"
          rx="6"
          stroke="lch(60% 64.37 141.95)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          fill="lch(60% 64.37 141.95)"
          stroke="none"
          d="M 3.5,3.5 L3.5,0 A3.5,3.5 0 1,1 0, 3.5 z"
          transform="translate(3.5,3.5)"
        />
      </>
    )}
    {status === "done" && (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="lch(48% 59.31 288.43)"
        d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM11.101 5.10104C11.433 4.76909 11.433 4.23091 11.101 3.89896C10.7691 3.56701 10.2309 3.56701 9.89896 3.89896L5.5 8.29792L4.10104 6.89896C3.7691 6.56701 3.2309 6.56701 2.89896 6.89896C2.56701 7.2309 2.56701 7.7691 2.89896 8.10104L4.89896 10.101C5.2309 10.433 5.7691 10.433 6.10104 10.101L11.101 5.10104Z"
      />
    )}
    {(status === "canceled" || status === "duplicate") && (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="lch(66% 10.68 258.94)"
        d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM5.03033 3.96967C4.73744 3.67678 4.26256 3.67678 3.96967 3.96967C3.67678 4.26256 3.67678 4.73744 3.96967 5.03033L5.93934 7L3.96967 8.96967C3.67678 9.26256 3.67678 9.73744 3.96967 10.0303C4.26256 10.3232 4.73744 10.3232 5.03033 10.0303L7 8.06066L8.96967 10.0303C9.26256 10.3232 9.73744 10.3232 10.0303 10.0303C10.3232 9.73744 10.3232 9.26256 10.0303 8.96967L8.06066 7L10.0303 5.03033C10.3232 4.73744 10.3232 4.26256 10.0303 3.96967C9.73744 3.67678 9.26256 3.67678 8.96967 3.96967L7 5.93934L5.03033 3.96967Z"
      />
    )}
  </svg>
);

export const GithubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 496 512"
    fill="currentColor"
    {...props}
  >
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
  </svg>
);
