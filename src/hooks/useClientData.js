import Swal from "sweetalert2";

const fetchData = async (endpoint, options) => {
    const response = await fetch("/api" + endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        ...options,
    });
    const data = await response.json();
    return data;
};

export const usePostData = async (endpoint, data) => {
    const {
        success,
        message,
        data: json,
    } = await fetchData(endpoint, { method: "POST", body: JSON.stringify(data) });

    Swal.fire({
        icon: success ? "success" : "error",
        title: success ? "¡Éxito!" : "¡Ups!",
        text: message,
        confirmButtonText: "Cerrar",
        background: "var(--color-base-100)",
        color: "var(--color-base-content)",
        confirmButtonColor: "var(--color-primary)",
    });

    return { success, message, data: json };
};
