import React from "react";

import AuthenticatedLayout from "~/components/common/AuthenticatedLayout";
import Main from "~/components/common/base/Main";
import PlannerForm from "~/components/planners/PlannerForm";

import { type NextPageWithLayout } from "~/types";

const EditPlanner: NextPageWithLayout = () => {
  return (
    <Main className="p-8">
      <h1 className="text-3xl font-semibold text-gray-300">Edit Planner</h1>
      <PlannerForm type="edit" />
    </Main>
  );
};

EditPlanner.getLayout = (page) => {
  return (
    <AuthenticatedLayout>
      <>{page}</>
    </AuthenticatedLayout>
  );
};

export default EditPlanner;
