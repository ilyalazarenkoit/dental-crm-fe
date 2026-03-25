/**
 * Thin wrapper around the shadcn/ui toast so the rest of the app
 * can call toast.success() / toast.error() / toast.info() without
 * knowing about the underlying { title, variant } object API.
 *
 * Variants:
 *   success     → green  (auth events, saves)
 *   info        → blue   (logout, neutral notices)
 *   destructive → red    (errors)
 */

import { toast as shadcnToast } from "@/hooks/use-toast";

type ToastOptions = {
  description?: string;
  duration?: number;
};

function toast(props: Parameters<typeof shadcnToast>[0]) {
  return shadcnToast(props);
}

toast.success = (message: string, options?: ToastOptions) =>
  shadcnToast({
    title: message,
    description: options?.description,
    duration: options?.duration ?? 4000,
    variant: "success",
  });

toast.error = (message: string, options?: ToastOptions) =>
  shadcnToast({
    title: message,
    description: options?.description,
    duration: options?.duration ?? 6000,
    variant: "destructive",
  });

toast.info = (message: string, options?: ToastOptions) =>
  shadcnToast({
    title: message,
    description: options?.description,
    duration: options?.duration ?? 4000,
    variant: "info",
  });

export { toast };
