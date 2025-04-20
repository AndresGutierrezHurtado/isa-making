import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "@/database/models";

export async function POST(request) {
    try {
        const { user_email, user_password } = await request.json();

        const userdb = await User.findOne({ where: { user_email } });

        if (!userdb) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Usuario no encontrado",
                },
                { status: 200 }
            );
        }

        const user = userdb.toJSON();

        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Contraseña incorrecta",
                },
                { status: 200 }
            );
        }

        const token = jwt.sign({ user_id: user.user_id }, process.env.NEXTAUTH_SECRET, {
            expiresIn: "1d",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Inicio de sesión exitoso",
                data: { token },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error al iniciar sesión: " + error.message,
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const token = await request.headers.get("authorization").split(" ")[1];
        if (!token) {
            return NextResponse.json(
                { success: false, message: "No se ha proporcionado un token" },
                { status: 200 }
            );
        }

        const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        const userdb = await User.findByPk(decodedToken.user_id, {
            attributes: { exclude: ["user_password"] },
            include: ["role"],
        });

        const user = userdb?.toJSON();
        return NextResponse.json(
            {
                success: true,
                data: user,
                message: "Sesión obtenida correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                data: error,
                message: "Error al obtener la sesión: " + error.message,
            },
            { status: 500 }
        );
    }
}
