/* eslint-disable */
// Esegue supabase/schema.sql contro il DB Postgres del progetto Supabase.
// Usa la connection string del pooler IPv4 (funziona sul free tier).
const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

const PROJECT_REF = "zxczwaeglokwlzezdtvf";
const PASSWORD = "S1lcwLSZdJ0cgTni";

// Try multiple hosts: direct (IPv6-only on free tier) + pooler (IPv4 OK).
const HOSTS = [
  // Session-mode pooler — supports DDL & multi-statement, ports 5432.
  { host: `aws-0-eu-central-1.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `aws-1-eu-central-1.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `aws-0-eu-west-1.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `aws-0-eu-west-2.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `aws-0-eu-west-3.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: `aws-0-us-east-1.pooler.supabase.com`, port: 5432, user: `postgres.${PROJECT_REF}` },
  // Direct connection (IPv6 — may fail in IPv4-only env).
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
  const sql = fs.readFileSync(
    path.join(__dirname, "..", "supabase", "schema.sql"),
    "utf8",
  );

  let client = null;
  let connectedTo = null;
  for (const cfg of HOSTS) {
    try {
      console.log(`Trying ${cfg.host}:${cfg.port} as ${cfg.user}...`);
      client = await tryConnect(cfg);
      connectedTo = `${cfg.host}:${cfg.port}`;
      console.log(`✓ Connected to ${connectedTo}`);
      break;
    } catch (err) {
      console.log(`  → failed (${err.code || err.message})`);
    }
  }
  if (!client) {
    console.error(
      "Impossibile connettersi a nessun host Postgres del progetto.",
    );
    process.exit(2);
  }

  try {
    console.log("Executing schema.sql ...");
    await client.query(sql);
    console.log("✓ Schema executed successfully");
  } catch (err) {
    console.error("✗ Errore eseguendo lo schema:", err.message);
    process.exit(3);
  } finally {
    await client.end();
  }
})();
