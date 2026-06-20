import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();

  if (!["계획중", "진행중", "완료"].includes(status)) {
    return NextResponse.json({ error: "잘못된 상태값입니다." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("stages")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ stage: data });
}
