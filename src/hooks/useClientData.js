import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const fetchData = async (endpoint, options) => {
    const response = await fetch(process.env.NEXT_PUBLIC_URL + "/api" + endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        ...options,
    });
    const data = await response.json();
    return data;
};

export const useGetData = (endpoint, options) => {
    const [data, setData] = useState(null);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        fetchData(endpoint, options).then((data) => {
            setData(data.data);
            setTotal(data?.total || 0);
            setLoading(false);
        });
    }, [endpoint, options, trigger]);

    const reload = () => {
        setTrigger((prev) => prev + 1);
    };

    return { data, total, loading, reload };
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

export const usePutData = async (endpoint, data) => {
    const {
        success,
        message,
        data: json,
    } = await fetchData(endpoint, { method: "PUT", body: JSON.stringify(data) });

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

export const useDeleteData = async (endpoint, data) => {
    const {
        success,
        message,
        data: json,
    } = await fetchData(endpoint, { method: "DELETE", body: JSON.stringify(data) });

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
