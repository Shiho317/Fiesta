import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  StopIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const SideBar = () => {
  const { data: userInfo } = useSession();
  const userName = userInfo?.user.name;
  const firstName = userName?.split(" ")[0];
  const router = useRouter();
  const currentPage = router.route;

  const sidebarList = [
    {
      name: firstName ? firstName?.toUpperCase() : "YOU",
      path: "/admin/user",
      logo: StopIcon,
    },
    {
      name: "EVENTS",
      path: "/admin/events",
      logo: CalendarIcon,
    },
    {
      name: "PLANNERS",
      path: "/admin/planners",
      logo: UserGroupIcon,
    },
    {
      name: "PLACES",
      path: "/admin/places",
      logo: MapPinIcon,
    },
    {
      name: "INVITATIONS",
      path: "/admin/invitations",
      logo: EnvelopeIcon,
    },
  ];

  return (
    <nav className="relative left-0 top-0 flex h-screen w-48 flex-col items-center justify-evenly rounded-[0_10px_10px_0] border border-fiesta-100 bg-fiesta-400/30 shadow-[0_0_15px_5px_rgba(46,16,101,0.25)]">
      <div className="mt-4">
        {/* TODO: Put LOGO here */}
        <h3 className="mt-4 text-center text-lg font-medium text-fiesta-300">
          HELLO.
        </h3>
      </div>
      <div className="border-b border-fiesta-300">
        <ul className="mb-8 mt-4 flex flex-col gap-16 p-4">
          {sidebarList.map((content, index) => (
            <li className="list-none" key={`${content.name}-${index}`}>
              <Link
                href={content.path}
                className={`flex flex-col items-center gap-2 text-sm font-medium ${
                  currentPage.includes(content.path)
                    ? "text-fiesta-400"
                    : "text-gray-400"
                }  hover:text-fiesta-400`}
              >
                <content.logo className="h-5 w-5" />
                {content.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link
        href={"/"}
        className="text-md mb-8 font-medium text-gray-400 hover:text-fiesta-400"
      >
        Our Support
      </Link>
    </nav>
  );
};

export default SideBar;
