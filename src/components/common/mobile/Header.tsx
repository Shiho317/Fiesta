import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

import Logo from "../../../../public/images/fiesta-logo.png";

const Header = () => {
  const signOutHandler = async () => {
    await signOut({ callbackUrl: "/auth/logout" });
  };

  return (
    <div className="fixed left-0 top-0 z-20 flex h-14 w-full items-center justify-center bg-fiesta-200 px-4 backdrop-blur-md backdrop-filter">
      <div className="grid w-full grid-cols-3 items-center">
        <h3 className="text-start text-fiesta-400">HELLO.</h3>
        <div className="flex h-10 w-full items-center justify-center overflow-hidden">
          <Image src={Logo} alt="fiesta-logo" width={150} priority />
        </div>
        <button
          type="button"
          className="text-end text-gray-400 hover:text-fiesta-400"
          onClick={signOutHandler}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Header;
