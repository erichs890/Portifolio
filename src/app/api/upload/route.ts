import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Upload initiated, reading formData...");
    
    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("File received:", { name: file?.name, size: file?.size, type: file?.type });

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo fornecido" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "O arquivo deve ser uma imagem" },
        { status: 400 }
      );
    }

    // Verificar configurações
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary config missing:", { cloudName, uploadPreset });
      return NextResponse.json(
        { success: false, error: "Configuração do Cloudinary não encontrada" },
        { status: 500 }
      );
    }

    // Preparar formulário para Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log("Sending to Cloudinary:", cloudinaryUrl);

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData,
    });

    console.log("Cloudinary response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Cloudinary error:", errorData);
      throw new Error(`Erro do Cloudinary: ${errorData.error?.message || response.statusText || "Upload falhou"}`);
    }

    const data = await response.json();
    console.log("Cloudinary success, secure_url:", data.secure_url);

    if (!data.secure_url) {
      throw new Error("URL segura não retornada pelo Cloudinary");
    }

    return NextResponse.json({
      success: true,
      data: {
        url: data.secure_url,
        publicId: data.public_id,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao fazer upload";
    console.error("Upload route error:", message, error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
