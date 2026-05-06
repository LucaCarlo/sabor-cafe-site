import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { UsersEditor } from "./users-editor";
import { addUser, deleteUser, updateUser } from "./actions";

export const dynamic = "force-dynamic";

type AppUserListItem = {
  user_id: string;
  email: string;
  display_name: string;
  role_id: string | null;
  role_name: string;
  created_at: string;
};

export default async function UsersAdmin() {
  const me = await requirePermission("users.manage");

  const sb = supabaseAdmin();
  // Get auth users (email, last sign in) + app_users + roles
  const { data: appUsers } = await sb
    .from("app_users")
    .select(
      "user_id, display_name, role_id, created_at, roles:role_id(id, name)",
    )
    .order("created_at", { ascending: true });

  // Fetch emails from auth.users via admin API for each user_id
  const list: AppUserListItem[] = [];
  for (const u of appUsers ?? []) {
    const { data: au } = await sb.auth.admin.getUserById(u.user_id);
    const r = u as unknown as {
      user_id: string;
      display_name: string;
      role_id: string | null;
      created_at: string;
      roles: { id: string; name: string } | null;
    };
    list.push({
      user_id: r.user_id,
      email: au.user?.email ?? "(nessuna email)",
      display_name: r.display_name,
      role_id: r.role_id,
      role_name: r.roles?.name ?? "—",
      created_at: r.created_at,
    });
  }

  const { data: roles } = await sb.from("roles").select("id, name, is_super").order("name");

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Sistema
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Utenti admin
        </h1>
        <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Crea nuovi utenti che possono accedere a /admin, assegna loro un ruolo
          per definire cosa possono modificare.
        </p>
      </header>

      <UsersEditor
        users={list}
        roles={roles ?? []}
        currentUserId={me.id}
        onAdd={addUser}
        onUpdate={updateUser}
        onDelete={deleteUser}
      />
    </div>
  );
}
