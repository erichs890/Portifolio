import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { handleApiError } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const featured = searchParams.get("featured") === "true";
    const statusParam = searchParams.get("status");
    const status = statusParam || undefined;

    const result = await projectService.getAllProjects(
      page,
      pageSize,
      featured ? true : undefined,
      status
    );

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
