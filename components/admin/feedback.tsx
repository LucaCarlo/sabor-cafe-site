"use client";

import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export function AdminToaster() {
  return <Toaster position="top-right" richColors closeButton />;
}

/** Reads ?ok=Saved or ?err=Message from the URL after a server action redirect. */
export function FlashFromQuery() {
  const sp = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const ok = sp.get("ok");
    const err = sp.get("err");
    if (ok) {
      toast.success(ok);
      const u = new URL(window.location.href);
      u.searchParams.delete("ok");
      router.replace(u.pathname + u.search);
    } else if (err) {
      toast.error(err);
      const u = new URL(window.location.href);
      u.searchParams.delete("err");
      router.replace(u.pathname + u.search);
    }
  }, [sp, router]);
  return null;
}
