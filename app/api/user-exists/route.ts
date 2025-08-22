import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const [row] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return NextResponse.json({ exists: !!row });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
