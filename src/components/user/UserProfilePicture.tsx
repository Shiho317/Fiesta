import { UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";

type UserProfilePicProp = {
  url?: string | undefined;
};

const UserProfilePicture = (props: UserProfilePicProp) => {
  const { data: session } = useSession();
  const { url } = props;

  const { mutate: updateUserProfilePic } = api.user.updateImage.useMutation({
    onSuccess: () => {
      toast.success("Updated your profile picture.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const uploadProfilePic = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const [file, setFile] = useState<string | ArrayBuffer | null>("");

  const changeProfilePic = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target?.files?.[0];
      if (!files) {
        return;
      }
      if (files.type !== "image/jpeg" && files.type !== "image/png") {
        toast.warning("Please choose jpeg or png file.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = () => {
        setFile(reader.result);
      };
    },
    []
  );

  const updateProfilePic = () => {
    updateUserProfilePic({
      id: session?.user.id as string,
      file: file as string,
    });
  };

  return (
    <div className="relative z-10 col-span-5 mt-4 flex items-center rounded-lg border border-gray-200 bg-fiesta-100/30 p-4 shadow-md shadow-gray-300/30 backdrop-blur-md backdrop-filter tablet:col-span-2">
      <div className="m-auto flex flex-col items-center gap-2">
        <div
          className="flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-300 hover:border-2 hover:border-fiesta-300"
          onClick={uploadProfilePic}
        >
          {!url && !file ? (
            <UserIcon className="h-24 w-24 text-gray-200" />
          ) : (
            <Image
              src={file ? (file as string) : (url as string)}
              alt="Profile Image"
              width={160}
              height={160}
            />
          )}
        </div>
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          className="hidden"
          onChange={changeProfilePic}
        />
        {file ? (
          <button
            type="button"
            className="cursor-pointer text-sm text-fiesta-400 hover:text-fiesta-300"
            onClick={updateProfilePic}
          >
            Update
          </button>
        ) : (
          <button
            type="button"
            className="cursor-pointer text-xs text-gray-400
              hover:text-fiesta-300"
            onClick={uploadProfilePic}
          >
            Change your picture
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfilePicture;
