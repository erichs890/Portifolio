import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { projectService } from "@/services/project.service";
import { UpdateProjectSchema } from "@/lib/validation";
import { handleApiError } from "@/utils/helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const project = await projectService.getProjectById(id);

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = UpdateProjectSchema.parse(body);

    const project = await projectService.updateProject(id, validated);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status || 400,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const project = await projectService.getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    await projectService.deleteProject(id);

    return NextResponse.json({
      success: true,
      message: "Projeto deletado com sucesso",
    });
  } catch (error) {
    console.error("DELETE project error:", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status || 500,
    });
  }
}
