import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import PlannerForm from "~/components/planners/PlannerForm";

import { type NextPageWithLayout } from "~/types";

const NewPlanner: NextPageWithLayout = () => {
  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">New Planner</h1>
      <PlannerForm type="create" />
    </Main>
  );
};

NewPlanner.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default NewPlanner;
