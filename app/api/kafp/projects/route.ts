import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const areaId = req.nextUrl.searchParams.get("area_id");

  let query = supabaseAdmin
    .from("kafp_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (areaId) {
    query = query.eq("area_id", areaId);
  }

  const { data: projects, error: projectsError } = await query;

  if (projectsError) {
    return NextResponse.json({ error: projectsError.message }, { status: 500 });
  }

  const { data: checklist, error: checklistError } = await supabaseAdmin
    .from("kafp_checklist_items")
    .select("*")
    .order("order_index", { ascending: true });

  if (checklistError) {
    return NextResponse.json({ error: checklistError.message }, { status: 500 });
  }

  const { data: links, error: linksError } = await supabaseAdmin
    .from("kafp_links")
    .select("*")
    .order("order_index", { ascending: true });

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

  const result = projects.map((project) => ({
    ...project,
    checklist: checklist.filter((c) => c.project_id === project.id),
    links: links.filter((l) => l.project_id === project.id),
  }));

  return NextResponse.json({ projects: result });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { area_id, name, deadline, status } = body;

  if (!area_id || typeof area_id !== "string") {
    return NextResponse.json({ error: "영역은 필수입니다." }, { status: 400 });
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "프로젝트 이름은 필수입니다." }, { status: 400 });
  }

  const { data: project, error } = await supabaseAdmin
    .from("kafp_projects")
    .insert({
      area_id,
      name,
      deadline: deadline || null,
      status: status || "기획중",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: { ...project, checklist: [], links: [] } });
}
