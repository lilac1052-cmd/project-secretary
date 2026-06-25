import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { text } = await req.json();

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "체크리스트 항목을 입력하세요." }, { status: 400 });
  }

  const { count } = await supabaseAdmin
    .from("kafp_checklist_items")
    .select("id", { count: "exact", head: true })
    .eq("project_id", id);

  const { data, error } = await supabaseAdmin
    .from("kafp_checklist_items")
    .insert({ project_id: id, text, order_index: count ?? 0 })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}
