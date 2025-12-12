"use client";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { useEffect, useState } from "react";
import { ValidateUserRegister } from "../../../../../../_lib_backend/validation/authValidation";
import axios from "axios";
import { redirect } from "next/navigation";

type registerForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [isSubmit, setIsSubmit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ValidateUserRegister),
  });

  const onSubmit = async (data: registerForm) => {
    setIsSubmit(true);
    try {
      const res = await axios.post("/api/crm/auth/register", data);
      toastingSuccess(res.data.message, () => redirect("/crm/auth/login"));
    } catch (error) {
      toastingError(error);
    } finally {
      reset();
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("access_token");
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center min-h-screen bg-background"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("name")}
                id="name"
                placeholder="John Doe"
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-red-500">{errors.name?.message}</p>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("email")}
                id="email"
                placeholder="m@example.com"
                type="email"
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-red-500">{errors.email?.message}</p>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("password")}
                id="password"
                type="password"
                className="pl-10"
                placeholder="********"
              />
            </div>
          </div>
          <p className="text-red-500">{errors.password?.message}</p>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("confirmPassword")}
                id="confirm-password"
                type="password"
                className="pl-10"
                placeholder="********"
              />
            </div>
          </div>
          <p className="text-red-500">{errors.confirmPassword?.message}</p>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                terms of service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                privacy policy
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button disabled={isSubmit} type="submit" className="w-full">
            Create account
          </Button>
          <div className="text-center text-sm">
            Already have an account?
            <Link href="/login" className="text-primary hover:underline ml-1">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
