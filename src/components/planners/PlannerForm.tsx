import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { api } from "~/utils/api";
import Input from "../common/base/Input";
import Button from "../common/base/Button";

type PlannerInputProp = {
  name: string;
  email: string;
  phone: string;
  organization: string;
};

type PlannerFormProp = {
  type: "edit" | "create";
};

const PlannerForm = (props: PlannerFormProp) => {
  const { data: session } = useSession();
  const { type } = props;

  const { register, handleSubmit, setValue } = useForm<PlannerInputProp>();
  const router = useRouter();
  const { id: plannerId } = router.query;

  const { data: plannerData, error } = api.planner.getById.useQuery({
    id: plannerId ? (plannerId as string) : "",
  });

  const { mutate: upsertPlanner } = api.planner.upsertPlanner.useMutation({
    onSuccess: () => {
      toast.success("You successfully saved your planner.");
      void router.push("/admin/planners");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: PlannerInputProp) => {
    const { name, email, phone, organization } = data;
    upsertPlanner({
      name,
      email,
      phone,
      organization,
      userId: session?.user.id as string,
      plannerId: (plannerId as string) ?? "",
    });
  };

  useEffect(() => {
    if (!error && plannerData) {
      setValue("name", plannerData.name);
      setValue("email", plannerData.email);
      setValue("phone", plannerData.phone ?? "");
      setValue("organization", plannerData.organization ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannerData]);

  return (
    <div className="relative z-10 mt-4 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
      <form
        className="grid grid-cols-2 gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="text"
          name="name"
          label="Name"
          placeholder="Jane Doe"
          required={true}
          register={register}
        />
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="janedoe@fiesta.com"
          required={true}
          register={register}
          readOnly={type === "edit" ? true : false}
        />
        <Input
          type="text"
          name="phone"
          label="Phone (Optional)"
          placeholder="+1(234) 567-8910"
          register={register}
        />
        <Input
          type="text"
          name="organization"
          placeholder="Fiesta"
          label="Company (Optional)"
          register={register}
        />
        <div className="col-span-2 mt-4 flex justify-between">
          <Button
            type="button"
            content="Back"
            className="rounded-md bg-gray-300 px-8 hover:bg-gray-200"
            onClick={() => void router.push("/admin/planners")}
          />
          <Button type="submit" content="Save" className="rounded-md px-8" />
        </div>
      </form>
    </div>
  );
};

export default PlannerForm;
