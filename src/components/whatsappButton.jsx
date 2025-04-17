import React from "react";
import { FaWhatsapp as WhatsappIcon } from "react-icons/fa";

export default function WhatsappButton() {
    return (
        <div className="fixed bottom-30 right-30 animate-bounce">
            <a href="https://wa.me/573178000000" target="_blank" className="btn btn-success btn-circle btn-xl shadow-[0_0_30px_10px_rgba(34,197,94,0.6)]">
                <WhatsappIcon size={24} />
            </a>
        </div>
    );
}
