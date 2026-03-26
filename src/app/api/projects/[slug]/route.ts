import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services/project.service";
import { handleApiError } from "@/utils/helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  try {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status,
    });
  }
}
