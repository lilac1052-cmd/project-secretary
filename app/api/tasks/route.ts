import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { project_id, title, due_date } = await req.json();

  if (!project_id || !title || !title.trim()) {
    return NextResponse.json({ error: "할 일 내용을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert({ project_id, title, due_date: due_date || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task: data });
}
