import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { handleApiError } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const results = await projectService.searchProjects(query);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status,
    });
  }
}
