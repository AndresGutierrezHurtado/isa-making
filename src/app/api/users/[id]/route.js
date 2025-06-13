import { NextResponse } from "next/server";
import { User } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const user = await User.findByPk(id, {
            include: ["role"],
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Usuario no encontrado",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: user,
                message: "Usuario obtenido correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener el usuario",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { user: userJSON } = await request.json();

        if (!userJSON) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No se proporcionaron datos para actualizar el usuario",
                },
                { status: 400 }
            );
        }

        const user = await User.findByPk(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Usuario no encontrado",
                },
                { status: 404 }
            );
        }

        await user.update(userJSON);

        return NextResponse.json(
            {
                success: true,
                data: user,
                message: "Usuario actualizado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al actualizar el usuario",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const user = await User.findByPk(id);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Usuario no encontrado",
                },
                { status: 404 }
            );
        }

        await user.destroy();

        return NextResponse.json(
            {
                success: true,
                message: "Usuario eliminado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al eliminar el usuario",
            },
            { status: 500 }
        );
    }
}
