"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import CarImage from "../../../../public/Forza-Horizon-5-Release-Date-How-to-pre-order-Download-Size-Everything-you-must-know.jpg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { redirect } from "next/navigation";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import axios from "axios";
import { ValidateUserLogin } from "../../../../_lib_backend/validation/authValidation";
import { Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
type loginForm = {
  email: string;
  password: string;
};

function Login() {
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
      const res = await axios.post("/api/shop/auth/customerLogin", data);
      localStorage.setItem("AccessToken", res.data.accessToken);
      toastingSuccess(res.data.message, () => redirect("/home"));
    } catch (error) {
      toastingError(error);
    } finally {
      reset();
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("AccessToken");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <Image
              src={CarImage}
              alt="Login image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="text-center max-w-md">
                Sign in to access your account, view your orders, and enjoy a
                personalized shopping experience.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Or{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-gray-900 hover:underline"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link href="/forgot-password" className="text-sm text-primary hover:underline">
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
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              </div>

              {/* Optional: Remember Me */}
              {/* 
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </Label>
          </div> 
          */}

              <div>
                <Button disabled={isSubmit} className="w-full">
                  Login
                </Button>
              </div>
            </form>

            <div className="mt-8">
              
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div> */}

              {/* <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                  Facebook
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Github className="h-5 w-5 text-gray-900 mr-2" />
                  GitHub
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
