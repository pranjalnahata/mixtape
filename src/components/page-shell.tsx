import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <Logo />
      <main className={cn("flex w-full flex-1 flex-col py-8", className)}>{children}</main>
      <Footer />
    </div>
  );
}
