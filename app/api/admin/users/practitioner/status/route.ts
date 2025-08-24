import { db } from "@/lib/db/connection";
import { practitioners } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { practitionerId, status } = await req.json();

    if (!["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await db
      .update(practitioners)
      .set({ status })
      .where(eq(practitioners.id, practitionerId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
