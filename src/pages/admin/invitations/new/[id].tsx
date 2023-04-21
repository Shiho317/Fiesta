import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import InvitationForm from "~/components/invitations/InvitationForm";

import { type NextPageWithLayout } from "~/types";

const NewInvitation: NextPageWithLayout = () => {
  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">New Invitation</h1>
      <InvitationForm />
    </Main>
  );
};

NewInvitation.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default NewInvitation;
