import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { technologyService } from "@/services/technology.service";
import { TechnologySchema } from "@/lib/validation";
import { handleApiError } from "@/utils/helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const technology = await technologyService.getTechnologyById(id);

    return NextResponse.json({
      success: true,
      data: technology,
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
    const validated = TechnologySchema.partial().parse(body);

    const technology = await technologyService.updateTechnology(id, validated);

    return NextResponse.json({
      success: true,
      data: technology,
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

    await technologyService.deleteTechnology(id);

    return NextResponse.json({
      success: true,
      message: "Tecnologia deletada com sucesso",
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.status,
    });
  }
}
