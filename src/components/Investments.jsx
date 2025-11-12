import React, { useLayoutEffect, useRef } from "react";
import PrimaryButton from "./buttons/PrimaryButton";
import Footer from "./Footer";
import AnimatedBackground from "./Background/AnimatedBackground";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { Trans, useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Investments = () => {
  const sectionRef = useRef(null);
  const { t } = useTranslation();
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // SplitText por palabras en h1 y h2
      const h1El = section.querySelector("h1");
      const h2El = section.querySelector("h2");
      let h1Inner, h2Inner;

      if (h1El) {
        new SplitText(h1El, {
          type: "words",
          wordsClass: "wordWrapper overflow-hidden inline-block",
        });
        h1Inner = new SplitText(h1El, { type: "words" });
      }

      if (h2El) {
        new SplitText(h2El, {
          type: "words",
          wordsClass: "wordWrapper overflow-hidden inline-block",
        });
        h2Inner = new SplitText(h2El, { type: "words" });
      }

      const topBtn = section.querySelector(".top-btn");
      const blocks = gsap.utils.toArray(".inv-block");
      const mobileBtn = section.querySelector(".mobile-btn");

      // Timeline de intro — más rápida y con mayor solape
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      if (h1Inner?.words?.length) {
        tl.from(
          h1Inner.words,
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.2, // <- antes 0.3
            stagger: 0.03, // <- antes 0.05
            force3D: true,
          },
          0
        );
      }

      if (h2Inner?.words?.length) {
        tl.from(
          h2Inner.words,
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.2, // <- antes 0.3
            stagger: 0.025, // <- antes 0.04
            force3D: true,
          },
          h1Inner ? "-=0.08" : 0 // solape mayor
        );
      }

      if (topBtn) {
        tl.from(
          topBtn,
          {
            y: 16,
            opacity: 0,
            duration: 0.2, // <- antes 0.3
            force3D: true,
          },
          "-=0.10"
        );
      }

      if (blocks.length) {
        tl.from(
          blocks,
          {
            y: 20,
            opacity: 0,
            duration: 0.22, // <- antes 0.3
            stagger: 0.08, // <- antes 0.12
            force3D: true,
          },
          "-=0.05" // entra casi a la vez que el botón superior
        );
      }

      if (mobileBtn) {
        tl.from(
          mobileBtn,
          {
            y: 16,
            opacity: 0,
            duration: 0.2, // <- antes 0.3
            force3D: true,
          },
          "-=0.12"
        );
      }

      // Dispara un poco antes en el viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%", // <- antes "top 70%"
        once: true,
        onEnter: () => tl.play(),
      });
    }, sectionRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="investments"
      ref={sectionRef}
      className="w-full h-auto xl:h-screen flex flex-col justify-center bg-primary z-20 gap-12 py-32 px-8 items-center relative"
    >
      <div className="absolute inset-0 -z-10 opacity-80 bg-black"></div>
      <AnimatedBackground />

      {/* Cabecera */}
      <div className="flex flex-col w-full gap-4 justify-start items-start 2xl-custom:absolute 2xl-custom:left-0 2xl-custom:top-32 2xl-custom:px-8 2xl:relative 2xl:inset-auto 2xl:px-0">
        <div className="flex w-full justify-between items-center">
          <h1 className="lg:text-5xl text-[2.1rem] lg:leading-normal leading-10 font-bold">
            {t("investments.title")}
          </h1>
          <PrimaryButton
            href="/investments"
            className="top-btn hidden lg:block bg-primary text-xl !py-3 !px-6 text-secondary hover:text-primary"
          >
            {t("investments.button")}
          </PrimaryButton>
        </div>
        <div className="flex flex-col">
          <h2 className="lg:text-xl text-left">{t("investments.subtitle")}</h2>
          <span className="mt-2">(Construction First)</span>
        </div>
        <PrimaryButton
          href="/investments"
          className="mobile-btn bg-primary mt-6 text-secondary self-center lg:hidden hover:text-primary"
        >
          {t("investments.button")}
        </PrimaryButton>
      </div>

      {/* Bloques */}
      <div className="flex flex-col w-full lg:gap-12 max-w-[90%] lg:max-w-[70%] h-auto">
        <div className="lg:flex-row flex flex-col">
          <div className="inv-block w-full h-full flex flex-col justify-center items-center relative py-6 lg:py-0">
            <span className="absolute -top-5 left-0 -translate-x-1/2 lg:-translate-x-1/2 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <span className="absolute -top-5 lg:-bottom-5 lg:top-auto right-0 lg:right-full translate-x-1/2 lg:translate-x-1/2 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <h2 className="lg:text-4xl text-2xl text-center font-bold">
              <Trans i18nKey="investments.grid.1.title">
                <br className="hidden lg:block" />
              </Trans>
            </h2>
            <p className="text-gray-400 text-sm text-center">
              From acquisition to pre-sale
              <br className="lg:hidden" /> under one
            </p>
          </div>

          <div className="inv-block lg:border-l lg:border-primary w-full h-full flex flex-col justify-center items-center relative py-6 lg:py-0">
            <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[0.5px] lg:top-1/2 lg:left-0 lg:-translate-y-1/2 lg:w-[0.5px] lg:h-[85%] bg-primary"></div>
            <span className="absolute top-0 lg:-top-5 right-0 -translate-y-1/2 lg:translate-y-0 translate-x-1/2 lg:translate-x-1/2 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <span className="absolute lg:-bottom-5 lg:top-auto top-0 left-0 lg:left-full -translate-x-1/2 lg:-translate-x-1/2 -translate-y-1/2 lg:translate-y-0 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <h2 className="lg:text-4xl text-2xl font-bold text-center">
              <Trans i18nKey="investments.grid.2.title">
                <br className="hidden lg:block" />
              </Trans>
            </h2>
            <p className="text-gray-400 text-sm text-center">
              {t("investments.grid.2.description")}
            </p>
          </div>
        </div>

        <div className="hidden lg:block w-full bg-primary h-[0.5px]"></div>

        <div className="lg:flex-row flex flex-col">
          <div className="inv-block w-full h-full flex flex-col justify-center items-center relative py-6 lg:py-0">
            <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[0.5px] lg:top-1/2 lg:left-0 lg:-translate-y-1/2 lg:w-[0.5px] lg:h-[85%] bg-primary"></div>
            <span className="absolute top-0 lg:-top-5 left-0 -translate-x-1/2 lg:-translate-x-1/2 -translate-y-1/2 lg:translate-y-0 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <span className="absolute top-0 lg:-bottom-5 lg:top-auto right-0 lg:right-full -translate-y-1/2 lg:translate-y-0 translate-x-1/2 lg:translate-x-1/2 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <h2 className="lg:text-4xl text-2xl text-center font-bold">
              <Trans i18nKey="investments.grid.3.title">
                <br className="hidden lg:block" />
              </Trans>
            </h2>
            <p className="text-gray-400 text-sm text-center">
              {t("investments.grid.3.description")}
            </p>
          </div>

          <div className="inv-block lg:border-l lg:border-primary w-full h-full flex flex-col justify-center items-center relative py-6 lg:py-0">
            <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[0.5px] lg:top-1/2 lg:left-0 lg:-translate-y-1/2 lg:w-[0.5px] lg:h-[85%] bg-primary"></div>
            <span className="absolute top-0 lg:-top-5 right-0 -translate-y-1/2 lg:translate-y-0 translate-x-1/2 lg:translate-x-1/2 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <span className="absolute lg:-bottom-5 lg:top-auto top-0 left-0 lg:left-full -translate-x-1/2 lg:-translate-x-1/2 -translate-y-1/2 lg:translate-y-0 text-primary opacity-40 text-2xl lg:text-4xl">
              +
            </span>
            <h2 className="lg:text-4xl text-2xl font-bold text-center">
              <Trans i18nKey="investments.grid.4.title">
                <br className="hidden lg:block" />
              </Trans>
            </h2>
            <p className="text-gray-400 text-sm text-center">
              {t("investments.grid.4.description")}
            </p>
          </div>
        </div>
      </div>

      <Footer className={"text-primary"} />
    </section>
  );
};

export default Investments;
