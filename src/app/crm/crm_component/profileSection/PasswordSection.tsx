"use client";
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
import { Separator } from "@radix-ui/react-separator";
import { Check } from "lucide-react";
import axiosAdmin from "@/lib/axios/axiosAdmin";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationUpdatePassword } from "../../../../../_lib_backend/validation/updatingUserInfoValidation";
import { useForm } from "react-hook-form";
import ConfirmationPopup from "../confirmation_popup/ConfirmationPopup";

function PasswordSection(AdminInfo: { email: string; id: string }) {
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
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(validationUpdatePassword),
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmNewPassword = watch("confirmNewPassword");

  const valid = () => {
    try {
      const newData = getValues();
      validationUpdatePassword.parse(newData);
      return setShowPopup(true);
    } catch (err) {
      setShowPopup(false);
      return toastingError(err);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const newData = {
        ...getValues(),
        id: AdminInfo.id,
        email: AdminInfo.email,
      };

      const res = await axiosAdmin.post("profile/updateAdminPassword", {
        id: AdminInfo.id,
        email: AdminInfo.email,
        currentPassword: newData.currentPassword,
        newPassword: newData.newPassword,
        confirmNewPassword: newData.confirmNewPassword,
      });

      return toastingSuccess(res);
    } catch (err) {
      return toastingError(err);
    } finally {
      reset();
      setShowPopup(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="space-y-1">
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              {...register("currentPassword")}
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
            />
          </div>
          <p className="text-red-500">{errors.currentPassword?.message}</p>

          <Separator />
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              {...register("newPassword")}
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
            />
          </div>
          <p className="text-red-500">{errors.newPassword?.message}</p>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              {...register("confirmNewPassword")}
              id="confirmNewPassword"
              type="password"
              placeholder="Confirm your new password"
            />
          </div>
          <p className="text-red-500">{errors.confirmNewPassword?.message}</p>

          <div className="text-sm text-muted-foreground">
            <p className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Password must be at least 8 characters long</span>
            </p>
            {/* <p className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>
              Password must include at least one number and one special
              character
            </span>
          </p> */}
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <Button
            type="button"
            disabled={!newPassword || !confirmNewPassword || !currentPassword}
            onClick={() => valid()}
          >
            Update Password
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

export default PasswordSection;
