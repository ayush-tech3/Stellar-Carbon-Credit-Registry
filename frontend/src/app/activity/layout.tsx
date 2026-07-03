import { AppShell } from "@/components/layout/AppShell";

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
