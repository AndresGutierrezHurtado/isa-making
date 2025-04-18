import { v2 as cloudinary } from "cloudinary";

(async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
})();

export const uploadImage = async (folder, image, name) => {
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "isa-making" + folder,
            resource_type: "image",
            overwrite: true,
            public_id: name,
        });

        return {
            success: true,
            message: "Imagen subida correctamente",
            data: result.secure_url,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error al subir la imagen: " + error.message,
        };
    }
};

export const deleteFile = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy("isa-making" + public_id);

        if (result.result === "not found") {
            return {
                success: false,
                message: "Imagen no encontrada",
            };
        }

        return {
            success: true,
            message: "Imagen eliminada correctamente",
            data: result,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error al eliminar la imagen: " + error.message,
            data: null,
        };
    }
};
