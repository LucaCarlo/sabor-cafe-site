import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin/guard";
import { login } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; redirect?: string }>;
}) {
  const me = await currentAdmin();
  if (me) redirect("/admin");
  const sp = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6">
      <div className="w-full max-w-[420px] border border-[var(--color-line)] bg-white p-9">
        <div className="mb-7 text-center">
          <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-brass)]">
            Admin Dashboard
          </span>
          <h1 className="mt-2 font-[var(--font-display)] text-[28px] leading-tight">
            <span className="brass-deep">Maison</span>{" "}
            <span className="italic">Sabor</span>
          </h1>
          <p className="mt-2 text-[13px] text-[var(--color-ink-mute)]">
            Accedi per gestire i contenuti del sito.
          </p>
        </div>

        {sp.err && (
          <div className="mb-5 border border-[var(--color-terra)]/30 bg-[var(--color-terra)]/10 px-3 py-2.5 text-[13px] text-[var(--color-terra)]">
            {sp.err}
          </div>
        )}

        <form action={login} className="space-y-4">
          <input type="hidden" name="redirect" value={sp.redirect ?? "/admin"} />
          <div>
            <label className="mb-1.5 block font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoFocus
              className="w-full border border-[var(--color-line)] bg-white px-3 py-2.5 text-[14px] focus:border-[var(--color-brass)] focus:outline-none"
              placeholder="lucacarlorecchio25@gmail.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full border border-[var(--color-line)] bg-white px-3 py-2.5 text-[14px] focus:border-[var(--color-brass)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-[var(--color-ink)] py-3 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-cream)] transition-colors hover:bg-[var(--color-brass-deep)]"
          >
            Entra
          </button>
        </form>

        <p className="mt-6 text-center text-[11.5px] text-[var(--color-ink-mute)]">
          Solo gli account autorizzati possono accedere.
        </p>
      </div>
    </div>
  );
}
