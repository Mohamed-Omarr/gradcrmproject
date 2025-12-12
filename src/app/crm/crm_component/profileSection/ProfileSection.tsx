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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { User } from "lucide-react";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import axiosAdmin from "@/lib/axios/axiosAdmin";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import ConfirmationPopup from "../confirmation_popup/ConfirmationPopup";
import { validationUpdateUsername } from "../../../../../_lib_backend/validation/updatingUserInfoValidation";

function ProfileSection(AdminInfo: {
  email: string;
  id: string;
  name: string;
}) {
  const [new_Name, setNew_Name] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const newData = {
    previousName: AdminInfo.name,
    newName: new_Name,
  };

  const valid = () => {
    try {
      validationUpdateUsername.parse(newData);
      return setShowPopup(true);
    } catch (err) {
      toastingError(err);
      return setShowPopup(false);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axiosAdmin.post("profile/updateAdminName", {
        id: AdminInfo.id,
        previousName: newData.previousName,
        newName: new_Name,
      });

      // later change handling the reload of page
      return toastingSuccess(res.data.message, () => window.location.reload());
    } catch (err) {
      return toastingError(err);
    } finally {
      setIsLoading(false);
      setShowPopup(false);
    }
  };

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          View and update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={AdminInfo.name}
                onChange={(e) => setNew_Name(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display-email">Email</Label>
              <div className="bg-muted rounded-md px-3 py-2">
                {AdminInfo.email}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          disabled={!new_Name || AdminInfo.name === new_Name}
          onClick={() => {
            valid();
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
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

export default ProfileSection;
