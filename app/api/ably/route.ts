import { NextResponse } from "next/server";
import Ably from "ably";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const rest = new Ably.Rest(process.env.ABLY_API_KEY!);

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") ?? undefined;

  const tokenRequest = await rest.auth.createTokenRequest({
    clientId,
  });

  console.log(clientId);

  console.log(clientId);
  return NextResponse.json(tokenRequest);
}
