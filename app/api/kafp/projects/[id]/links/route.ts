import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { label, url, type } = await req.json();

  if (!label || typeof label !== "string" || !label.trim()) {
    return NextResponse.json({ error: "링크 이름을 입력하세요." }, { status: 400 });
  }
  if (!url || typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "URL을 입력하세요." }, { status: 400 });
  }

  const { count } = await supabaseAdmin
    .from("kafp_links")
    .select("id", { count: "exact", head: true })
    .eq("project_id", id);

  const { data, error } = await supabaseAdmin
    .from("kafp_links")
    .insert({ project_id: id, label, url, type: type || "기타", order_index: count ?? 0 })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ link: data });
}
