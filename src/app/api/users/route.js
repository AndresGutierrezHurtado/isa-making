import { NextResponse } from "next/server";
import { Op } from "sequelize";

import { User } from "@/database/models";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const sort = searchParams.get("sort") || "createdAt:desc";
        const search = searchParams.get("search") || "";
        const offset = (page - 1) * limit;

        const { rows: data, count: total } = await User.findAndCountAll({
            include: ["role"],
            offset,
            limit,
            order: [[sort.split(":")[0], sort.split(":")[1]]],
            where: {
                [Op.or]: [
                    { user_name: { [Op.like]: `%${search}%` } },
                    { user_email: { [Op.like]: `%${search}%` } },
                ],
            },
        });

        return NextResponse.json(
            {
                success: true,
                data,
                total,
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

export async function POST(request) {
    try {
        const { user: userJSON } = await request.json();

        if (!userJSON) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No se proporcionaron datos para crear el usuario",
                },
                { status: 400 }
            );
        }

        const user = await User.create(userJSON);

        return NextResponse.json(
            {
                success: true,
                data: user,
                message: "Usuario creado correctamente",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al crear el usuario: " + error.message,
            },
            { status: 500 }
        );
    }
}
