import { DashboardLayout } from "@/components/navigation";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
