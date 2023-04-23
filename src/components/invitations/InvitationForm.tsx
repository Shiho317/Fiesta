import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Mustache from "mustache";
import parse from "html-react-parser";
import moment from "moment";

import Input from "../common/base/Input";
import Button from "../common/base/Button";
import { api } from "~/utils/api";
import LoadingQuery from "../common/base/LoadingQuery";

type InvitationInputProp = {
  name: string;
  email: string;
  expiresAt: Date;
  sendAt: Date;
};

const InvitationForm = () => {
  const { data: session } = useSession();

  const { register, handleSubmit } = useForm<InvitationInputProp>();

  const router = useRouter();
  const { id: eventId } = router.query;

  const { mutate: createInvitation, isLoading } =
    api.invitation.createInvitation.useMutation({
      onSuccess: () => {
        toast.success("Sent invitation successfully.📮");
        void router.push(`/admin/invitations/list/${eventId as string}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { data: event } = api.event.getById.useQuery({
    id: eventId as string,
  });

  console.log(event);

  const { data: invitationTemplates } =
    api.cardTemplate.getAllTemplates.useQuery();

  const splitDateAndTIme = moment(event?.eventDate)
    .format("MMM Do YYYY, h:mm a")
    .split(", ");

  const view = {
    eventName: event?.name,
    eventDate: splitDateAndTIme[0],
    eventTime: splitDateAndTIme[1],
    eventVenue: event?.venue?.address,
    attend: "",
    decline: "",
    user: session?.user.name,
  };

  const initialSample = `<html><body><div style="display:flex;align-items:center;justify-content:center;"><h1 style="font-size:40px;color:#dcdcdc;">Card Sample</h1></div></body></html>`;

  const [cardSample, setCardSample] = useState<string>(initialSample);

  const [template, setTemplate] = useState<string>("");

  const templateChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setTemplate(templateId);
    const template = invitationTemplates?.find(
      (template) => template.id === templateId
    );
    const output = Mustache.render(template?.html as string, view);
    setCardSample(output);
  };

  const submitHandler = (data: InvitationInputProp) => {
    const { name, email, expiresAt, sendAt } = data;
    createInvitation({
      name,
      email,
      expiresAt: moment(expiresAt).toDate(),
      templateId: template,
      eventId: eventId as string,
      invitedById: session?.user.id as string,
      sendAt: moment(sendAt).toDate(),
      user: {
        name: session?.user.name as string,
        email: session?.user.email as string,
      },
    });
  };

  return (
    <LoadingQuery isLoading={isLoading} label="Sending invitation...">
      <div className="relative z-10 mt-4 flex gap-8 rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter">
        <form
          className="grid flex-1 gap-2"
          onSubmit={handleSubmit(submitHandler)}
        >
          <Input
            type="text"
            name="name"
            label="Guest Name"
            placeholder="Guest Fiesta"
            required={true}
            register={register}
          />
          <Input
            type="email"
            name="email"
            label="Guest Email"
            placeholder="guest@fiesta.com"
            required={true}
            register={register}
          />
          <Input
            type="datetime-local"
            name="expiresAt"
            label="Response By"
            required={true}
            register={register}
          />
          <div>
            <label htmlFor="templateType" className="block">
              Email Template
            </label>
            <select
              name="templateId"
              className="w-full p-3 text-center text-black outline-none"
              required
              onChange={templateChangeHandler}
            >
              <option selected disabled>
                Choose template
              </option>
              {invitationTemplates &&
                invitationTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
            </select>
          </div>
          <Input
            type="datetime-local"
            name="sendAt"
            label="Send Invitation At (Optional)"
            register={register}
          />
          <div className="mt-4 flex justify-between">
            <Button
              type="button"
              content="Back"
              className="rounded-md bg-gray-300 px-8 hover:bg-gray-200"
              onClick={() =>
                void router.push(`/admin/invitations/list/${eventId as string}`)
              }
            />
            <Button type="submit" content="Save" className="rounded-md px-8" />
          </div>
        </form>
        <div className="pointer-events-none flex flex-1 items-center justify-center bg-white">
          {parse(cardSample)}
        </div>
      </div>
    </LoadingQuery>
  );
};

export default InvitationForm;
