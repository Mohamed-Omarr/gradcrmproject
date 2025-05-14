"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CarImage from "../../../../public/Forza-Horizon-5-Release-Date-How-to-pre-order-Download-Size-Everything-you-must-know.jpg"
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidateUserRegister } from "../../../../_lib_backend/validation/authValidation";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { redirect } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import axios from "axios";

type registerForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
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
      const res = await axios.post("/api/shop/auth/customerRegister", data);
      toastingSuccess(res, () => redirect("/auth/login"));
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
              alt="Fashion store registration"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-8">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-center max-w-md">
                Create an account to enjoy exclusive benefits, track your
                orders, and get personalized recommendations.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 text-center">
                  Create your account
                </h1>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Name */}
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
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="pl-10"
                  />
                </div>
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long and include a
                  number and a special character.
                </p>
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("confirmPassword")}
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    className="pl-10"
                  />
                </div>
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword?.message}
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {/* Submit */}
              <div>
                <Button disabled={isSubmit} type="submit" className="w-full">
                  Create account
                </Button>
              </div>

              {/* Divider */}
              
              {/* <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div> */}

              {/* Social */}
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

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
