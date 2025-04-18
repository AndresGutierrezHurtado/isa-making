import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { User } from "@/database/models";

export async function GET(request, { params }) {
    try {
        const users = await User.findAll({
            paranoid: false,
            where: {
                deletedAt: {
                    [Op.not]: null,
                },
            },
            include: ["role"],
        });

        return NextResponse.json(
            {
                success: true,
                data: users,
                message: "Usuarios obtenidos correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al obtener los usuarios",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;

        const user = await User.findByPk(id, { paranoid: false });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Usuario no encontrado",
                },
                { status: 404 }
            );
        }

        await user.restore();

        return NextResponse.json(
            {
                success: true,
                message: "Usuario restaurado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al restaurar el usuario",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const user = await User.findByPk(id, { paranoid: false });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Usuario no encontrado",
                },
                { status: 404 }
            );
        }

        await user.destroy({ force: true });

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
