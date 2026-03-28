import type { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FormSectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const FormSectionHeader = ({ icon: Icon, title }: FormSectionHeaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>
      <Separator />
    </div>
  );
};
