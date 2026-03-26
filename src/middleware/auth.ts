import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function withAuth(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return session;
}

export async function withAdminAuth(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  return session;
}
