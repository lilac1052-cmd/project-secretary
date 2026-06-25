import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function progressFromDone(items: { done: boolean }[]): number | null {
  if (items.length === 0) return null;
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

export async function GET() {
  const { data: areas, error: areasError } = await supabaseAdmin
    .from("kafp_areas")
    .select("*")
    .order("order_index", { ascending: true });

  if (areasError) {
    return NextResponse.json({ error: areasError.message }, { status: 500 });
  }

  const { data: projects, error: projectsError } = await supabaseAdmin
    .from("kafp_projects")
    .select("id, area_id");

  if (projectsError) {
    return NextResponse.json({ error: projectsError.message }, { status: 500 });
  }

  const { data: checklist, error: checklistError } = await supabaseAdmin
    .from("kafp_checklist_items")
    .select("project_id, done");

  if (checklistError) {
    return NextResponse.json({ error: checklistError.message }, { status: 500 });
  }

  const result = areas.map((area) => {
    const areaProjects = projects.filter((p) => p.area_id === area.id);
    const progresses = areaProjects
      .map((p) =>
        progressFromDone(checklist.filter((c) => c.project_id === p.id))
      )
      .filter((p): p is number => p !== null);
    const avgProgress =
      progresses.length > 0
        ? Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length)
        : null;

    return {
      ...area,
      project_count: areaProjects.length,
      avg_progress: avgProgress,
    };
  });

  return NextResponse.json({ areas: result });
}
