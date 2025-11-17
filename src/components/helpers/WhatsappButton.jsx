import React, { forwardRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const WhatsappButton = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full fixed z-[200] right-4 bottom-8 lg:bottom-12 w-16 h-16 flex items-center justify-center transition-all duration-500 hover:scale-110"
      >
        <DotLottieReact
          className="w-full h-full"
          src="/assets/lottie/chatbot.lottie"
          loop
          autoplay
        />
      </button>

      {/* Overlay (si está cerrado = oculto) */}
      <div
        className={`fixed inset-0 z-[300] ${
          isOpen ? "visible opacity-100 bg-black/50" : "invisible opacity-0"
        } transition-all duration-300`}
        onClick={() => setIsOpen(false)}
      >
        {/* Contenedor del chat */}
        <div
          className="w-[90vw] max-w-[400px] h-[600px] md:w-[400px] lg:w-1/4 lg:h-4/5 shadow-2xl rounded-2xl overflow-hidden fixed bottom-8 right-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* iFrame del chatbot (montado siempre, solo ocultado) */}
          <iframe
            src="https://n8n.ddcdevelopments.com/webhook/3ce67889-3aaa-4d6a-9c46-bb1be66b4ef8/chat"
            title="DDC Chatbot"
            className={`w-full h-full border-none rounded-2xl transition-all ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        </div>
      </div>
    </>
  );
});

export default WhatsappButton;
