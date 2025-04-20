import { email, minLength, nonEmpty, object, parse, pipe, regex, string, url } from "valibot";

export const useValidateForm = (form, data) => {
    let schema;

    switch (form) {
        case "login-form":
            schema = object({
                user_email: pipe(
                    string("El correo es requerido"),
                    nonEmpty("El correo es requerido"),
                    email("Ingresa un correo válido")
                ),
                user_password: pipe(
                    string("La contraseña es requerida"),
                    regex(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                        "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un símbolo"
                    )
                ),
            });
            break;
        case "register-form":
            schema = object({
                user_name: pipe(
                    string("El nombre es requerido"),
                    nonEmpty("El nombre es requerido"),
                    minLength(2, "El nombre debe tener al menos 2 caracteres")
                ),
                user_lastname: pipe(
                    string("El apellido es requerido"),
                    nonEmpty("El apellido es requerido"),
                    minLength(2, "El apellido debe tener al menos 2 caracteres")
                ),
                user_email: pipe(
                    string("El correo es requerido"),
                    nonEmpty("El correo es requerido"),
                    email("Ingresa un correo válido")
                ),
                user_password: pipe(
                    string("La contraseña es requerida"),
                    regex(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                        "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un símbolo"
                    )
                ),
            });
            break;
        case "update-user-form":
            schema = object({
                user_name: pipe(
                    string("El nombre es requerido"),
                    nonEmpty("El nombre es requerido"),
                    minLength(2, "El nombre debe tener al menos 2 caracteres")
                ),
                user_lastname: pipe(
                    string("El apellido es requerido"),
                    nonEmpty("El apellido es requerido"),
                    minLength(2, "El apellido debe tener al menos 2 caracteres")
                ),
                user_email: pipe(
                    string("El correo es requerido"),
                    nonEmpty("El correo es requerido"),
                    email("Ingresa un correo válido")
                ),
                user_password: pipe(
                    string("La contraseña es requerida"),
                    regex(
                        /^$|^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                        "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un símbolo, o estar vacía"
                    )
                ),
                role_id: pipe(
                    string("El rol es requerido"),
                    nonEmpty("El rol es requerido"),
                    regex(/^[1-2]|^$/, "El rol debe ser 1, 2 o estar vacío")
                ),
            });
            break;
        case "checkout-form":
            schema = object({
                payerDocument: pipe(
                    string("El documento es requerido"),
                    nonEmpty("El documento es requerido"),
                    minLength(10, "El documento debe tener al menos 10 caracteres")
                ),
                payerDocumentType: pipe(
                    string("El tipo de documento es requerido"),
                    nonEmpty("El tipo de documento es requerido")
                ),
                payerEmail: pipe(
                    string("El correo es requerido"),
                    nonEmpty("El correo es requerido"),
                    email("Ingresa un correo válido")
                ),
                payerFullName: pipe(
                    string("El nombre es requerido"),
                    nonEmpty("El nombre es requerido"),
                    minLength(6, "El nombre debe tener al menos 6 caracteres")
                ),
                payerPhone: pipe(
                    string("El teléfono es requerido"),
                    nonEmpty("El teléfono es requerido"),
                    regex(/^[0-9]{10}$/, "El teléfono debe contener exactamente 10 números")
                ),
                shippingAddress: pipe(
                    string("La dirección es requerida"),
                    nonEmpty("La dirección es requerida"),
                    minLength(5, "La dirección debe tener al menos 5 caracteres")
                ),
            });
            break;
        case "category-form":
            schema = object({
                category_name: pipe(
                    string("El nombre es requerido"),
                    nonEmpty("El nombre es requerido"),
                    minLength(2, "El nombre debe tener al menos 2 caracteres")
                ),
                category_slug: pipe(
                    string("El slug es requerido"),
                    nonEmpty("El slug es requerido"),
                    minLength(2, "El slug debe tener al menos 2 caracteres"),
                    regex(
                        /^[a-z]+(?:-[a-z]+)*$/,
                        "El slug debe contener solo letras minúsculas y guiones"
                    )
                ),
            });
            break;
        case "edit-product-form":
            schema = object({
                product_name: pipe(
                    string("El nombre es requerido"),
                    nonEmpty("El nombre es requerido"),
                    minLength(2, "El nombre debe tener al menos 2 caracteres")
                ),
                product_color: pipe(
                    string("El color es requerido"),
                    nonEmpty("El color es requerido"),
                    regex(/^#([0-9a-fA-F]{6})$/, "El color debe ser un código hexadecimal válido")
                ),
                product_stock: pipe(
                    string("El stock es requerido"),
                    nonEmpty("El stock es requerido"),
                    regex(/^[0-9]+$/, "El stock debe ser un número")
                ),
            });
            break;
        case "update-order":
            schema = object({
                shipping_courier: pipe(
                    string("La empresa mensajera es requerida"),
                    nonEmpty("La empresa mensajera es requerida")
                ),
                shipping_guide: pipe(
                    string("La guía es requerida"),
                    nonEmpty("La guía es requerida")
                ),
                tracking_url: pipe(
                    string("La URL de seguimiento es requerida"),
                    nonEmpty("La URL de seguimiento es requerida"),
                    url("La URL de seguimiento debe ser una URL válida")
                ),
                shipping_state: pipe(
                    string("El estado es requerido"),
                    nonEmpty("El estado es requerido")
                ),
            });
            break;
        default:
            break;
    }

    try {
        const $previousErrors = document.querySelectorAll(".error-message");
        $previousErrors.forEach((error) => {
            const $input = error.closest("fieldset").querySelector("input");
            if ($input) $input.classList.remove("input-error", "select-error", "textarea-error");
            error.remove();
        });

        const response = parse(schema, data);
        return { success: true, data: response, message: "Formulario válido" };
    } catch (error) {
        const { name, issues } = error;

        const errors = issues.map((issue) => {
            const { message } = issue;
            const path = issue.path[0].key;
            return { path, message };
        });

        errors.forEach((error) => {
            const $input = document.getElementsByName(error.path)[0];
            if ($input) $input.classList.add("input-error", "select-error", "textarea-error");
            const $fieldset = $input.closest("fieldset");
            if ($fieldset) {
                const $error = document.createElement("p");
                $error.classList.add("text-red-500", "text-sm", "error-message");
                $error.textContent = error.message;
                $fieldset.appendChild($error);
            }
        });

        return { success: false, data: null, message: error };
    }
};
