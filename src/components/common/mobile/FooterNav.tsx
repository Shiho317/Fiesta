import {
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
  StopIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const FooterNav = () => {
  const router = useRouter();
  const currentPage = router.route;

  const navigationList = [
    {
      path: "/admin/user",
      logo: StopIcon,
    },
    {
      path: "/admin/events",
      logo: CalendarIcon,
    },
    {
      path: "/admin/planners",
      logo: UserGroupIcon,
    },
    {
      path: "/admin/places",
      logo: MapPinIcon,
    },
    {
      path: "/admin/invitations",
      logo: EnvelopeIcon,
    },
  ];

  return (
    <nav className="fixed bottom-5 left-1/2 z-30 flex h-12 w-3/4 -translate-x-1/2 items-center justify-center rounded-full bg-fiesta-200 shadow-[0_0_15px_5px_rgba(46,16,101,0.25)] tablet:w-1/2">
      <ul className="flex w-full items-center justify-evenly">
        {navigationList.map((content) => (
          <li className="list-none" key={content.path}>
            <Link
              href={content.path}
              className={`flex items-center justify-center ${
                currentPage.includes(content.path)
                  ? "text-fiesta-400"
                  : "text-gray-400"
              }  hover:text-fiesta-400`}
            >
              <content.logo className="h-6 w-6" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FooterNav;
