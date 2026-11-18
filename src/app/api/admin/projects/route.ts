import { refreshPublishedProjects } from "@/lib/publicProjects";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { projectService } from "@/services/project.service";
import { CreateProjectSchema } from "@/lib/validation";
import { handleApiError } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const result = await projectService.getAdminProjects(page, pageSize);

    return NextResponse.json({
      success: true,
      data: result,
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
    const validated = CreateProjectSchema.parse(body);

    const project = await projectService.createProject(validated);

    refreshPublishedProjects();

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/projects] Error:", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status || 400,
    });
  }
}
