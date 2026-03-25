"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"

// Progress bar that shrinks from full width to zero over `duration` ms.
// Pauses on hover (Radix also pauses the auto-dismiss timer on hover).
const PROGRESS_COLOR: Record<string, string> = {
  default:     "bg-gray-400",
  success:     "bg-green-400",
  info:        "bg-blue-400",
  destructive: "bg-red-400",
}

function ToastProgressBar({
  duration,
  variant,
}: {
  duration: number
  variant?: string | null
}) {
  const color = PROGRESS_COLOR[variant ?? "default"] ?? PROGRESS_COLOR.default

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10">
      <div
        className={cn(
          "h-full origin-left group-hover:[animation-play-state:paused]",
          color
        )}
        style={{
          animation: `toast-progress ${duration}ms linear forwards`,
        }}
      />
    </div>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, duration, variant, ...props }) => (
        <Toast key={id} duration={duration} variant={variant} {...props}>
          <div className="grid gap-0.5">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
          <ToastProgressBar
            duration={duration ?? 5000}
            variant={variant}
          />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
