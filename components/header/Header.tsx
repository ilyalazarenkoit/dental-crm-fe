"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CrmPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const CrmPageHeader = ({
  title,
  description,
  actions,
  className,
}: CrmPageHeaderProps) => {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white/95 shadow-sm",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      <div className="absolute -right-12 top-0 h-24 w-24 rounded-full bg-gray-100/80 blur-2xl" />

      <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default CrmPageHeader;
