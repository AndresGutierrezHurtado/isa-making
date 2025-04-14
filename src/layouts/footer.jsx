import Link from "next/link";
import React from "react";

// Components
import {
    FacebookIcon,
    InstagramIcon,
    TwitterIcon,
    YoutubeIcon,
    WhatsappIcon,
} from "@/components/icons";

import * as Icons from "@/components/icons";

export default function Footer() {
    return (
        <footer className="w-full bg-base-200 border-t border-base-300 text-base-content py-5 space-y-10">
            <div className="w-full max-w-[1300px] mx-auto">
                <div className="w-full grid grid-cols-4 gap-10">
                    {[
                        {
                            icon: "WhatsappIcon",
                            title: "¿Necesitas ayuda?",
                            text: "Contactanos",
                            href: "https://wa.me/573178283927",
                        },
                        {
                            icon: "BoxIcon",
                            title: "Comprar ahora",
                            text: "Paga con PayU",
                            href: "https://wa.me/573178283927",
                        },
                        {
                            icon: "ShippingIcon",
                            title: "Envíos",
                            text: "Envíos a todo Colombia",
                            href: "https://wa.me/573178283927",
                        },
                        {
                            icon: "MoneyIcon",
                            title: "Envios Gratis",
                            text: "Por compras superiores a $200.000",
                            href: "https://wa.me/573178283927",
                        },
                    ].map((i, index) => {
                        const Icon = Icons[i.icon];
                        return (
                            <Link
                                key={index}
                                href={i.href}
                                target="_blank"
                                className="flex items-center gap-3 mx-auto"
                            >
                                <Icon size={45} />
                                <div>
                                    <h3 className="text-2xl font-bold">{i.title}</h3>
                                    <p className="text-base-content/80">{i.text}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <hr className="border-base-300" />
            <div className="w-full max-w-[1300px] mx-auto space-y-2">
                <h3 className="text-2xl font-otomanopee text-center">
                    ISA Making
                    <span className="inline-block text-sm font-normal [vertical-align:super] ml-0.5">
                        &copy;
                    </span>
                </h3>

                <span className="flex justify-center gap-5">
                    <button className="btn btn-lg btn-ghost btn-circle">
                        <FacebookIcon size={25} />
                    </button>
                    <button className="btn btn-lg btn-ghost btn-circle">
                        <InstagramIcon size={25} />
                    </button>
                    <button className="btn btn-lg btn-ghost btn-circle">
                        <TwitterIcon size={25} />
                    </button>
                    <button className="btn btn-lg btn-ghost btn-circle">
                        <YoutubeIcon size={25} />
                    </button>
                </span>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <h4 className="text-2xl font-medium">Contacto</h4>
                        <p>
                            <span className="font-bold mr-1">Email:</span>
                            <a className="hover:underline" href="mailto:isamaking@gmail.com">
                                isamaking@gmail.com
                            </a>
                        </p>
                        <p>
                            <span className="font-bold mr-1">Teléfono:</span>
                            <a className="hover:underline" href="tel:+573178283927">
                                +57 317 8283 927
                            </a>
                        </p>
                        <p>
                            <span className="font-bold mr-1">Dirección:</span>
                            <a className="hover:underline" href="https://goo.gl/maps/1234567890">
                                Calle 123, Ciudad, País
                            </a>
                        </p>
                    </div>
                    <div>
                        <h4 className="text-2xl font-medium">Ayuda</h4>
                        <Link className="hover:underline" href="/shipping">
                            Seguimiento de envío
                        </Link>
                    </div>
                    <div>
                        <h4 className="text-2xl font-medium">Sobre la marca</h4>

                        <p>
                            <Link className="hover:underline" href="/collections">
                                Colecciones
                            </Link>
                        </p>
                        <p>
                            <Link className="hover:underline" href="/collections/man">
                                Hombre
                            </Link>
                        </p>
                        <p>
                            <Link className="hover:underline" href="/collections/woman">
                                Mujer
                            </Link>
                        </p>
                        <p>
                            <Link className="hover:underline" href="/about">
                                Sobre nosotros
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
