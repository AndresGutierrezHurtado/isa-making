import React from "react";

export default function LoadingComponent() {
    return (
        <div className="flex flex-col justify-center items-center h-[70vh]">
            <span className="loading loading-bars w-40"></span>
            <p className="text-lg font-bold">Cargando...</p>
        </div>
    );
}
