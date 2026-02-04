import { AppShell } from "@/components/layout/app-shell";
import { PaddleProvider } from "@/providers/paddle-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaddleProvider>
      <AppShell>{children}</AppShell>
    </PaddleProvider>
  );
}
