import { NextResponse } from "next/server";

// Models
import { Media } from "@/database/models";

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const media = await Media.findByPk(id);

        if (!media) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Media no encontrada",
                },
                { status: 404 }
            );
        }

        await Media.destroy({
            where: {
                media_id: id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Media eliminada correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al eliminar la media: " + error.message,
            },
            { status: 500 }
        );
    }
}
