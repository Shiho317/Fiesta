import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import Input from "../common/base/Input";
import Button from "../common/base/Button";
import { toast } from "react-toastify";

type PlaceInputProp = {
  name: string;
  country: string;
  state_province: string;
  city: string;
  address: string;
  zipcode: string;
};

const PlaceForm = () => {
  const { data: session } = useSession();

  const { register, handleSubmit, setValue } = useForm<PlaceInputProp>();
  const router = useRouter();
  const { id: placeId } = router.query;

  const { data: placeData, error } = api.venue.getById.useQuery({
    id: (placeId as string) ?? "",
  });

  const { mutate: upsertPlace } = api.venue.upsertVenue.useMutation({
    onSuccess: () => {
      toast.success("You successfully saved your place.");
      void router.push("/admin/places");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: PlaceInputProp) => {
    const { name, country, state_province, city, address, zipcode } = data;
    upsertPlace({
      name,
      country,
      state_province,
      city,
      address,
      zipcode,
      userId: session?.user.id as string,
      venueId: (placeId as string) ?? "",
    });
  };

  useEffect(() => {
    if (!error && placeData) {
      setValue("name", placeData.name);
      setValue("country", placeData.country);
      setValue("state_province", placeData.state_province);
      setValue("city", placeData.city);
      setValue("address", placeData.address);
      setValue("zipcode", placeData.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeData]);

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
          placeholder="David Lam Park"
          required={true}
          register={register}
        />
        <Input
          type="text"
          name="country"
          label="Country"
          placeholder="Canada"
          required={true}
          register={register}
        />
        <Input
          type="text"
          name="state_province"
          label="State / Province"
          placeholder="BC"
          required={true}
          register={register}
        />
        <Input
          type="text"
          name="city"
          label="City"
          placeholder="Vancouver"
          required={true}
          register={register}
        />
        <Input
          type="text"
          name="address"
          label="Address"
          placeholder="1300 Pacific Blvd"
          required={true}
          register={register}
        />
        <Input
          type="text"
          name="zipcode"
          label="Zip Code"
          placeholder="V6Z 2Y1"
          required={true}
          register={register}
        />
        <div className="col-span-2 mt-4 flex justify-between">
          <Button
            type="button"
            content="Back"
            className="rounded-md bg-gray-300 px-8 hover:bg-gray-200"
            onClick={() => void router.push("/admin/places")}
          />
          <Button type="submit" content="Save" className="rounded-md px-8" />
        </div>
      </form>
    </div>
  );
};

export default PlaceForm;
