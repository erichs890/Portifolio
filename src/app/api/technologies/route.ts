import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { technologyService } from "@/services/technology.service";
import { TechnologySchema } from "@/lib/validation";
import { handleApiError } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const technologies = await technologyService.getAllTechnologies();

    return NextResponse.json({
      success: true,
      data: technologies,
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = TechnologySchema.parse(body);

    const technology = await technologyService.createTechnology(validated);

    return NextResponse.json(
      {
        success: true,
        data: technology,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status || 400,
    });
  }
}
