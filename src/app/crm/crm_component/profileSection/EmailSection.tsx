import React, { useState } from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../../../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { validationUpdateEmail } from "../../../../../_lib_backend/validation/updatingUserInfoValidation";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import ConfirmationPopup from "../confirmation_popup/ConfirmationPopup";
import axiosAdmin from "@/lib/axios/axiosAdmin";

function EmailSection(AdminInfo: { email: string; id: string }) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      newEmail: "",
      password: "",
      previousEmail: AdminInfo.email,
    },
    resolver: zodResolver(validationUpdateEmail),
  });

  const new_Email = watch("newEmail");
  const password = watch("password");

  const valid = () => {
    try {
      const newData = getValues();
      validationUpdateEmail.parse(newData);
      return setShowPopup(true);
    } catch (err) {
      setShowPopup(false);
      return toastingError(err);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const newData = getValues();
      const res = await axiosAdmin.post("profile/updateAdminEmail", {
        id: AdminInfo.id,
        previousEmail: newData.previousEmail,
        newEmail: newData.newEmail,
        password: newData.password,
      });

      // later change handling the reload of page
      return toastingSuccess(res, () => window.location.reload());
    } catch (err) {
      return toastingError(err);
    } finally {
      setShowPopup(false);
      setIsLoading(false);
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="space-y-1">
          <CardTitle>Change Email</CardTitle>
          <CardDescription>
            Update your email address. You will need to verify your current
            password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Current Email</Label>
            <p className="bg-muted rounded-md px-3 py-2">{AdminInfo.email}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">New Email</Label>
            <Input
              {...register("newEmail")}
              id="newEmail"
              type="email"
              placeholder="Enter your new email"
            />
          </div>
          <p className="text-red-500">{errors.newEmail?.message}</p>

          <div className="space-y-2">
            <Label htmlFor="password">Current Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter your current password"
            />
          </div>
          <p className="text-red-500">{errors.password?.message}</p>
        </CardContent>
        <CardFooter className="mt-4">
          <Button
            type="button"
            disabled={!new_Email || !password}
            onClick={() => valid()}
          >
            Update Email
          </Button>
        </CardFooter>
      </form>
      {showPopup && (
        <ConfirmationPopup
          onConfirm={() => onSubmit()}
          onCancel={() => setShowPopup(false)}
          title={"Please confirm the following process"}
          message={"please click on yes or cancel"}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

export default EmailSection;
