import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PERMISSIONS } from "@/lib/admin/permissions";
import { RolesEditor } from "./roles-editor";
import { addRole, deleteRole, updateRole } from "./actions";

export const dynamic = "force-dynamic";

export default async function RolesAdmin() {
  await requirePermission("roles.manage");
  const sb = supabaseAdmin();

  const { data: roles } = await sb
    .from("roles")
    .select("id, name, description, is_super, created_at")
    .order("is_super", { ascending: false })
    .order("name", { ascending: true });

  const { data: rolePerms } = await sb
    .from("role_permissions")
    .select("role_id, permission_key");

  const { data: roleUserCount } = await sb
    .from("app_users")
    .select("role_id");

  const permsByRole: Record<string, string[]> = {};
  for (const rp of rolePerms ?? []) {
    const r = rp as { role_id: string; permission_key: string };
    if (!permsByRole[r.role_id]) permsByRole[r.role_id] = [];
    permsByRole[r.role_id].push(r.permission_key);
  }
  const userCountByRole: Record<string, number> = {};
  for (const u of roleUserCount ?? []) {
    const k = (u as { role_id: string }).role_id;
    userCountByRole[k] = (userCountByRole[k] ?? 0) + 1;
  }

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Sistema
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Ruoli e permessi
        </h1>
        <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Crea ruoli con set di permessi specifici. Ogni utente è assegnato a un
          solo ruolo. Il <strong>Superadmin</strong> ha sempre tutti i permessi
          (non si può modificare).
        </p>
      </header>

      <RolesEditor
        roles={(roles ?? []).map((r) => {
          const x = r as { id: string; name: string; description: string; is_super: boolean; created_at: string };
          return {
            ...x,
            permissions: permsByRole[x.id] ?? [],
            user_count: userCountByRole[x.id] ?? 0,
          };
        })}
        permissions={PERMISSIONS}
        onAdd={addRole}
        onUpdate={updateRole}
        onDelete={deleteRole}
      />
    </div>
  );
}
