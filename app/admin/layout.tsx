import type { Metadata } from "next";
import { Suspense } from "react";
import { currentAdmin } from "@/lib/admin/guard";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminToaster, FlashFromQuery } from "@/components/admin/feedback";

export const metadata: Metadata = {
  title: "Admin · Maison Sabor",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await currentAdmin();

  // No user yet → render the children alone (login page handles its own UI).
  if (!me) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)]">
        {children}
        <AdminToaster />
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-cream)]">
      <div className="flex min-h-screen">
        <AdminSidebar email={me.email ?? ""} />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-[1200px] px-8 py-8">
            <Suspense fallback={null}>
              <FlashFromQuery />
            </Suspense>
            {children}
          </div>
        </main>
      </div>
      <AdminToaster />
    </div>
  );
}
