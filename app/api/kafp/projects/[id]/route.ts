import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: project, error: projectError } = await supabaseAdmin
    .from("kafp_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  const { data: checklist, error: checklistError } = await supabaseAdmin
    .from("kafp_checklist_items")
    .select("*")
    .eq("project_id", id)
    .order("order_index", { ascending: true });

  if (checklistError) {
    return NextResponse.json({ error: checklistError.message }, { status: 500 });
  }

  const { data: links, error: linksError } = await supabaseAdmin
    .from("kafp_links")
    .select("*")
    .eq("project_id", id)
    .order("order_index", { ascending: true });

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  return NextResponse.json({ project: { ...project, checklist, links } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, deadline, status } = body;

  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (deadline !== undefined) update.deadline = deadline || null;
  if (status !== undefined) update.status = status;

  const { data, error } = await supabaseAdmin
    .from("kafp_projects")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("kafp_projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
