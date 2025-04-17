import React from "react";

export const metadata = {
    title: "Sobre Nosotros | ISA Making",
    description: "Sobre Nosotros de ISA Making",
};

export default function Page() {
    return (
        <section className="w-full px-3">
            <div className="w-full max-w-[1300px] mx-auto py-10">
                <div className="w-full flex flex-col md:flex-row items-center gap-10">
                    <figure className="w-full md:w-1/2 aspect-[10/9] rounded-lg overflow-hidden">
                        <img
                            src="https://static.bershka.net/4/static/itxwebstandard/images/test/company/company14.jpg?20250414015203"
                            alt="About"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    </figure>
                    <div className="w-full md:w-1/2 space-y-6">
                        <h1 className="text-6xl font-extrabold uppercase">Sobre Nosotros</h1>
                        <p className="text-xl text-pretty leading-[1.2]">
                            Isa Making nació de la pasión por la moda como una forma de expresión
                            personal. Creemos que cada prenda tiene el poder de contar una historia,
                            de reflejar la personalidad y el estilo de quien la lleva. Nuestro
                            objetivo es diseñar piezas auténticas, versátiles y con alma, que
                            permitan a las personas expresarse de manera auténtica y sentirse
                            cómodas en su propia piel. Cada diseño tiene un propósito: inspirar
                            confianza, comodidad y autenticidad en aquellos que nos eligen.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
