import React, { forwardRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslation } from "react-i18next";

const WhatsappButton = forwardRef((props, ref) => {
  // Mantenemos los estados por si los necesitas en un futuro, 
  // aunque ya no controlan la visibilidad del botón de WhatsApp
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // Función para cerrar todo
  const closeAll = () => {
    setMenuOpen(false);
    setChatOpen(false);
  };

  return (
    <>
      {/* --- BOTÓN WHATSAPP DIRECTO --- */}
      {/* Se ha ajustado la posición a bottom-8 para que ocupe el lugar principal */}
      <div className="fixed z-[201] right-4 bottom-8 lg:bottom-12">
        <a
          href="https://wa.me/+17865661632"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <DotLottieReact
            src="/assets/lottie/whatsapp_animated_dark.lottie"
            loop
            autoplay
            className="w-14 h-14" // Ajustado el tamaño para que luzca bien en el círculo de 20
          />
        </a>
      </div>

      {/* --- BOTONES SECUNDARIOS Y OTROS (COMENTADOS) --- 
      <div className="fixed z-[200] right-8 bottom-32 flex flex-col gap-4 items-center">
        <div className={`hidden w-12 h-12 transition-all duration-500 delay-75 transform ${menuOpen ? "scale-100 translate-y-0 opacity-100" : " translate-y-10 opacity-0 pointer-events-none"
          }`}>
          <button
            onClick={() => setChatOpen(true)}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <DotLottieReact
              src="/assets/lottie/chatbot_dark.lottie"
              loop
              autoplay
            />
          </button>
        </div>
      </div>
      */}

      {/* --- BOTÓN PRINCIPAL TRIGGER (COMENTADO) --- 
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`rounded-full fixed z-[201] right-4 bottom-8 lg:bottom-12 w-20 h-20 flex items-center justify-center transition-all duration-500 ${menuOpen ? "rotate-45 scale-90" : "hover:scale-110"
          }`}
      >
        <DotLottieReact
          className="w-full h-full"
          src="/assets/lottie/outside_animation.lottie"
          loop
          autoplay
        />
      </button>
      */}

      {/* --- OVERLAY E IFRAME DEL CHAT (COMENTADO) --- 
      <div
        className={`fixed inset-0 z-[300] ${chatOpen ? "visible opacity-100 bg-black/50" : "invisible opacity-0"
          } transition-all duration-300`}
        onClick={closeAll}
      >
        <div
          className={`w-[90vw] max-w-[400px] h-[600px] md:w-[400px] lg:w-1/4 lg:h-4/5 shadow-2xl rounded-2xl overflow-hidden fixed bottom-8 right-4 transition-transform duration-500 ${chatOpen ? "translate-y-0" : "translate-y-[120%]"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            key={i18n.language}
            src={
              i18n.language?.startsWith("en")
                ? "https://n8n.ddcdevelopments.com/webhook/1129330b-4416-4e70-b32a-eaceeaade7ff/chat?chatSession=en"
                : "https://n8n.ddcdevelopments.com/webhook/3ce67889-3aaa-4d6a-9c46-bb1be66b4ef8/chat?chatSession=es"
            }
            title="DDC Chatbot"
            className="w-full h-full border-none rounded-2xl bg-white"
          />
        </div>
      </div>
      */}
    </>
  );
});

export default WhatsappButton;