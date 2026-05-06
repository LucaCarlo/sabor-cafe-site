import { NextResponse } from "next/server";
import sharp from "sharp";
import { currentAdmin } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MAX_DIM = 2200; // largest side, px
const QUALITY = 80;

export async function GET() {
  const me = await currentAdmin();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ media: data ?? [] });
}

export async function POST(request: Request) {
  const me = await currentAdmin();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }
  const alt = String(form.get("alt") ?? "");
  const originalName = (file as File).name || "upload.jpg";

  const buf = Buffer.from(await file.arrayBuffer());

  // Resize + convert to WebP
  let img = sharp(buf, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width > MAX_DIM || height > MAX_DIM) {
    img = img.resize({
      width: width >= height ? MAX_DIM : undefined,
      height: height > width ? MAX_DIM : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  const out = await img.webp({ quality: QUALITY }).toBuffer({ resolveWithObject: true });

  const safeBase = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .toLowerCase()
    .slice(0, 60) || "image";
  const fileName = `${Date.now()}-${safeBase}.webp`;
  const storagePath = fileName;

  const sb = supabaseAdmin();

  const { error: upErr } = await sb.storage
    .from("media")
    .upload(storagePath, out.data, {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000, immutable",
      upsert: false,
    });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: pub } = sb.storage.from("media").getPublicUrl(storagePath);
  const publicUrl = pub.publicUrl;

  const { data: row, error: insErr } = await sb
    .from("media")
    .insert({
      file_name: fileName,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: "image/webp",
      width: out.info.width,
      height: out.info.height,
      size_bytes: out.info.size,
      alt,
    })
    .select("*")
    .single();
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  return NextResponse.json({ media: row });
}

export async function DELETE(request: Request) {
  const me = await currentAdmin();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const sb = supabaseAdmin();
  const { data: row, error: getErr } = await sb
    .from("media")
    .select("*")
    .eq("id", id)
    .single();
  if (getErr || !row) return NextResponse.json({ error: "not found" }, { status: 404 });

  await sb.storage.from("media").remove([row.storage_path]);
  await sb.from("media").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
