"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEmailInput } from "@/hooks/useEmailInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define form state types
type FormStatus = "idle" | "loading" | "success" | "error";

// Form validation schema using Zod
const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResendVerificationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { handleChange, handleKeyDown, handlePaste } = useEmailInput();

  // Initialize form with react-hook-form and Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(
          data.message || t("auth.email-verification.resend-error")
        );
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(t("auth.email-verification.resend-error"));
      console.error("Error resending verification email:", error);
    }
  };

  // Animation variants for different states
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-muted/40">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>{t("auth.email-verification.resend-title")}</CardTitle>
          <CardDescription>
            {t("auth.email-verification.resend-description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-green-700 font-medium">
                {t("auth.email-verification.resend-success")}
              </p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  {t("auth.email-verification.go-to-sign-in")}
                </Button>
              </div>
            </motion.div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.email")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("auth.email-placeholder")}
                          autoComplete="email"
                          onChange={(e) => {
                            handleChange(e);
                            field.onChange(e.target.value.toLowerCase());
                          }}
                          onKeyDown={handleKeyDown}
                          onPaste={(e) => {
                            handlePaste(e);
                            // После обработки paste нужно обновить значение в форме
                            setTimeout(() => {
                              field.onChange(e.currentTarget.value);
                            }, 0);
                          }}
                          disabled={status === "loading"}
                          className={
                            form.formState.errors.email
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {status === "error" && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "loading"}
                  >
                    {status === "loading"
                      ? t("auth.email-verification.sending")
                      : t("auth.email-verification.send-email")}
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-muted-foreground hover:text-primary font-medium"
                    >
                      <Button variant="outline" className="w-full">
                        {t("auth.signin")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
