import { useSession } from "next-auth/react";
import React from "react";

const SideBar = () => {
  const { data: userInfo } = useSession();
  const sidebarList = [
    {
      name: "Events",
      page: "",
    },
    {
      name: "Profile",
      page: "",
    },
    {
      name: "My Friends",
      page: "",
    },
    {
      name: "My Places",
      page: "",
    },
  ];
  return (
    <div className="absolute left-0 top-0 h-full w-1/5 bg-black">
      {/* TODO: Put LOGO here */}
      <h3>Hello, {userInfo?.user.name}</h3>
      <ul>
        {sidebarList.map((content, index) => (
          <li className="list-none" key={`${content.name}-${index}`}>
            {content.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
