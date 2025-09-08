"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "keep-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeSlash, SpinnerGap } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FullScreenLoader } from "@components/ui/full-screen-loader";
import { AuthErrorDisplay } from "@components/auth/AuthErrorDisplay";
import { setCredentials } from "@store/features/authSlice";
import { AuthService } from "@lib/api/auth.service";
import { handleApiResponse } from "@/lib/error-handler";

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      const result = handleApiResponse(response, t, "auth.errors");
      if (result.success && "accessToken" in response) {
        // Handle successful login
        dispatch(
          setCredentials({
            accessToken: response.accessToken,
            user: response.user,
          })
        );

        toast.success(t("auth.login-success"));
        router.replace(decodeURI(callbackUrl));
      } else {
        // Handle specific error cases
        if (response.error?.code === "E401_EMAIL_NOT_VERIFIED") {
          setFormError(t("auth.errors.verification-required"));
        } else if (response.error?.code === "E401_ACCOUNT_NOT_ACTIVE") {
          setFormError(t("auth.errors.account-locked"));
        } else if (response.error?.code === "E401_INVALID_CREDENTIALS") {
          setFormError(t("auth.errors.invalid-credentials"));
        } else {
          setFormError(result.message || t("auth.errors.server-error"));
        }

        // Focus on email field for credential errors
        if (response.error?.code === "E401_INVALID_CREDENTIALS") {
          form.setFocus("email");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError(t("auth.errors.server-error"));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <FullScreenLoader
        isLoading={isLoading}
        message={t("auth.logging-in", "Signing in...")}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthErrorDisplay error={formError} />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  {t("auth.email")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("auth.email")}
                    className={
                      form.formState.errors.email
                        ? "border-red-400 focus-visible:ring-red-400"
                        : ""
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  {t("auth.password")}
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.password")}
                      className={
                        form.formState.errors.password
                          ? "border-red-400 focus-visible:ring-red-400 pr-10"
                          : "pr-10"
                      }
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {t("auth.remember-me", "Remember me")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "auth.remember-me-description",
                      "Keep me signed in for 30 days"
                    )}
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? (
                <>
                  <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.logging-in")}
                </>
              ) : (
                t("auth.login")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
