/* eslint-disable */
// Esegue il file passato come argomento contro il DB Postgres del progetto Supabase.
// Uso: node scripts/run-migration.js supabase/migrations/002_users_roles_rebrand.sql
const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

const PROJECT_REF = "zxczwaeglokwlzezdtvf";
const PASSWORD = "S1lcwLSZdJ0cgTni";

const HOSTS = [
  { host: `aws-0-eu-west-1.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `aws-0-eu-central-1.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `aws-1-eu-central-1.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `db.${PROJECT_REF}.supabase.co`, port: 5432, user: `postgres` },
];

async function tryConnect(cfg) {
  const client = new Client({
    host: cfg.host,
    port: cfg.port,
    database: "postgres",
    user: cfg.user,
    password: PASSWORD,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  await client.connect();
  return client;
}

(async () => {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node scripts/run-migration.js <path-to-sql>");
    process.exit(1);
  }
  const sql = fs.readFileSync(path.resolve(file), "utf8");

  let client = null;
  for (const cfg of HOSTS) {
    try {
      console.log(`Trying ${cfg.host}:${cfg.port} ...`);
      client = await tryConnect(cfg);
      console.log(`✓ Connected to ${cfg.host}`);
      break;
    } catch (err) {
      console.log(`  → failed (${err.code || err.message})`);
    }
  }
  if (!client) {
    console.error("Impossibile connettersi.");
    process.exit(2);
  }

  try {
    console.log(`Executing ${file} ...`);
    await client.query(sql);
    console.log("✓ Migration applied");
  } catch (err) {
    console.error("✗ Errore:", err.message);
    process.exit(3);
  } finally {
    await client.end();
  }
})();
