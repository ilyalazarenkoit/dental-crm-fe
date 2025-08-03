"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "keep-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@store/services/ninoxAuthService";

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = ({ callbackUrl }: { callbackUrl: string }) => {
  // const { t } = useTranslation();
  // const router = useRouter();
  // const dispatch = useDispatch();
  // const [showPassword, setShowPassword] = useState(false);
  // const [login, { isLoading }] = useLoginMutation();

  // // Initialize form with react-hook-form and zod validation
  // const form = useForm<LoginFormValues>({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  // });

  // Handle form submission
  // const onSubmit = async (data: LoginFormValues) => {
  //   try {
  //     const response = await login({
  //       email: data.email,
  //       password: data.password,
  //     }).unwrap();

  //     if (response?.token) {
  //       // Store token in cookie (handled by the API)
  //       dispatch(setToken(response.token));
  //       toast.success(t("auth.login-success"));

  //       // Redirect to the callback URL or dashboard
  //       router.push(decodeURI(callbackUrl));
  //     } else {
  //       toast.error(t("auth.login-error"));
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error(t("auth.login-error"));
  //   }
  // };
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
};
