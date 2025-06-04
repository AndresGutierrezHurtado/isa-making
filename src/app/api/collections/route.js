import { Category } from "@/database/models";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const collections = await Category.findAll();

        return NextResponse.json(
            {
                success: true,
                data: collections,
                message: "Colecciones obtenidas correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener las colecciones",
            },
            { status: 500 }
        );
    }
}
