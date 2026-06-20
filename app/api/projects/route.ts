import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data: projects, error: projectsError } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (projectsError) {
    return NextResponse.json({ error: projectsError.message }, { status: 500 });
  }

  const { data: stages, error: stagesError } = await supabaseAdmin
    .from("stages")
    .select("*")
    .order("order_index", { ascending: true });

  if (stagesError) {
    return NextResponse.json({ error: stagesError.message }, { status: 500 });
  }

  const { data: tasks, error: tasksError } = await supabaseAdmin
    .from("tasks")
    .select("*");

  if (tasksError) {
    return NextResponse.json({ error: tasksError.message }, { status: 500 });
  }

  const result = projects.map((project) => ({
    ...project,
    stages: stages.filter((s) => s.project_id === project.id),
    tasks: tasks.filter((t) => t.project_id === project.id),
  }));

  return NextResponse.json({ projects: result });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, type, partner, start_date, end_date, key_requirements, doc_link, stages } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "프로젝트 이름은 필수입니다." }, { status: 400 });
  }

  const { data: project, error: projectError } = await supabaseAdmin
    .from("projects")
    .insert({
      name,
      type: type || null,
      partner: partner || null,
      start_date: start_date || null,
      end_date: end_date || null,
      key_requirements: key_requirements || null,
      doc_link: doc_link || null,
    })
    .select()
    .single();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }

  const validStages = (stages || []).filter((s: { name: string }) => s.name && s.name.trim());

  if (validStages.length > 0) {
    const { error: stagesError } = await supabaseAdmin.from("stages").insert(
      validStages.map((s: { name: string; due_date?: string }, index: number) => ({
        project_id: project.id,
        name: s.name,
        due_date: s.due_date || null,
        order_index: index,
      }))
    );

    if (stagesError) {
      return NextResponse.json({ error: stagesError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ project });
}
