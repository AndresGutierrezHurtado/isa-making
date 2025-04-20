import { NextResponse } from "next/server";
import { Size } from "@/database/models";

export async function GET(req, res) {
    try {
        const sizes = await Size.findAll();

        return NextResponse.json({
            success: true,
            data: sizes,
            message: "Tallas obtenidas correctamente",
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Error al obtener las tallas",
        });
    }
}
