"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

export const Header = ({ title, actions, className }: HeaderProps) => {
  return (
    <header className={cn("relative overflow-hidden mb-4", className)}>
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between ">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            {title}
          </h1>
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

export default Header;
