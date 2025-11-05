import React, { forwardRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { InvestmentDialog } from "./InvestmentDialog";

const WhatsappButton = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a className="rounded-full" onClick={() => setOpen(true)}>
        <div
          ref={ref}
          className={`fixed z-[200] ${
            props.className ?? "bottom-8 lg:bottom-12"
          } right-4 w-16 h-16 flex items-center justify-centers transition-all duration-500`}
        >
          <DotLottieReact
            className="w-full h-full"
            src="/assets/lottie/whatsapp_animated_dark.lottie"
            loop
            autoplay
          />
        </div>
      </a>
      <InvestmentDialog
        open={open}
        onClose={() => setOpen(false)}
        investmentTitle={"Responda"}
      />
    </>
  );
});

export default WhatsappButton;
