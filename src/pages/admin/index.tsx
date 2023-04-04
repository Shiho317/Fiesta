import { useSession } from "next-auth/react";
import React from "react";

const Admin = () => {
  // const {data: session} = useSession();
  const session = useSession();
  console.log(session);
  return <div>index</div>;
};

export default Admin;
