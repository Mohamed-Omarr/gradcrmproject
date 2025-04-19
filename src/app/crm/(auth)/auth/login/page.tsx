"use client";
// import Link from "next/link";
import { Mail, Lock } from "lucide-react";
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
// import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toastingSuccess } from "@/lib/crm_api_toast/toastingSuccess";
import { redirect } from "next/navigation";
import { toastingError } from "@/lib/crm_api_toast/toastingErrors";
import { ValidateUserLogin } from "../../../../../../_lib_backend/validation/authValidation";
import axios from "axios";

type loginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [isSubmit, setIsSubmit] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(ValidateUserLogin),
  });

  const onSubmit = async (data: loginForm) => {
    setIsSubmit(true);
    try {
      const res = await axios.post("/api/crm/auth/login", data);
      localStorage.setItem("access_token",res.data.accessToken)
      toastingSuccess(res,()=>redirect("/crm/dashboard"));
    } catch (error) {
      toastingError(error);
    } finally {
      reset();
      setIsSubmit(false);
    }
  };

  useEffect(()=>{
    localStorage.removeItem("access_token");
  },[])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center min-h-screen bg-background"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("email")}
                id="email"
                placeholder="email@example.com"
                type="email"
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-red-500">{errors.email?.message}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {/* <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link> */}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="********"
                className="pl-10"
              />
            </div>
          </div>
          <p className="text-red-500">{errors.password?.message}</p>

          {/* <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </Label>
          </div> */}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button disabled={isSubmit} className="w-full">
            Login
          </Button>
          {/* <div className="text-center text-sm">
            Don not have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">Google</Button>
            <Button variant="outline">GitHub</Button>
          </div> */}
        </CardFooter>
      </Card>
    </form>
  );
}
