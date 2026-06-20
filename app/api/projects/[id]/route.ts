import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: project, error: projectError } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  const { data: stages, error: stagesError } = await supabaseAdmin
    .from("stages")
    .select("*")
    .eq("project_id", id)
    .order("order_index", { ascending: true });

  if (stagesError) {
    return NextResponse.json({ error: stagesError.message }, { status: 500 });
  }

  const { data: tasks, error: tasksError } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("project_id", id);

  if (tasksError) {
    return NextResponse.json({ error: tasksError.message }, { status: 500 });
  }

  return NextResponse.json({ project, stages, tasks });
}
