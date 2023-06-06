import React from "react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../../../../public/images/fiesta-logo.png";

const Header = () => {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-20 w-full items-center justify-center bg-fiesta-300/50 px-4 backdrop-blur-md backdrop-filter">
      <Link href={"/"}>
        <Image src={Logo} alt="fiesta-logo" width={200} priority />
      </Link>
    </div>
  );
};

export default Header;
