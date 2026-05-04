import React, { useLayoutEffect, useState, useRef } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  EffectCoverflow,
  Navigation,
} from "swiper/modules";
import Footer from "./Footer";
import PrimaryButton from "./buttons/PrimaryButton";
import { AnimatePresence, motion } from "framer-motion";
import { useSplitWords } from "./Hooks/useSplitWords";
import { useTranslation } from "react-i18next";

const projects = [
  {
    id: "Villa_Santa_Marta",
    title: "Villa Santa Marta",
    image: "assets/projects/bg/bg__1.jpeg",
    year: Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020,
  },
  {
    id: "Villa_Victor",
    title: "Villa Victor",
    image: "assets/projects/bg/bg__2.jpeg",
    year: Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020,
  },
  {
    id: "Villa_Ochoa",
    title: "Villa Ochoa",
    image: "assets/projects/bg/bg__3.jpeg",
    year: Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020,
  },
  {
    id: "Villa_Esplanade",
    title: "Villa Esplanade",
    image: "assets/projects/bg/bg__4.jpeg",
    year: Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020,
  },
  {
    id: "Villa_Guajira",
    title: "Villa Guajira",
    image: "assets/projects/bg/bg__5.jpeg",
    year: Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020,
  },
  {
    id: "Villa_Tortuga",
    title: "Villa Tortuga",
    image: "assets/projects/bg/bg__6.jpeg",
    year: Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020,
  },
  {
    id: "Villa_Barranquilla",
    title: "Villa Barranquilla",
    image: "assets/projects/bg/bg__7.jpeg",
    year: Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020,
  },
];

const Projects = () => {
  const [topValue, setTopValue] = useState(0);
  const [bottomValue, setBottomValue] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const { t } = useTranslation();
  useSplitWords(".split-words");
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 637px) and (max-width: 1023px)");
    const onChange = (e) => setIsMd(e.matches);
    setIsMd(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setTopValue((vw * 0.562) / 2 + vh / 2);
      setBottomValue((vh - ((vw * 0.562) / 2 + vh / 2)) / 2);
    };
    calc();
    window.addEventListener("orientationchange", calc, { passive: true });
    return () => window.removeEventListener("orientationchange", calc);
  }, []);

  const handleProjectClick = (projectId) => {
    window.location.href = `/projects/${projectId}`;
  };

  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);

  const onInit = (sw) => {
    swiperRef.current = sw;
    setActive(typeof sw.realIndex === "number" ? sw.realIndex : sw.activeIndex);
  };

  const onSlideChange = (sw) => {
    setActive(typeof sw.realIndex === "number" ? sw.realIndex : sw.activeIndex);
  };

  const current = projects[active] ?? projects[0];

  return (
    <section
      id="projects"
      className="w-full h-screen flex items-center justify-center px-8 bg-primary relative"
    >
      <h1 className="split-words absolute left-0 top-28 md-custom:top-24 lg:top-28 text-4xl font-bold mb-8 px-8 text-secondary">
        {t("projects.title")}
      </h1>
      <div className="relative w-full md-custom:w-[59%] lg:w-[35%] aspect-video text-secondary">
        <span className="absolute -top-5 md-custom:-top-6 lg:-top-8 left-0 -translate-x-1/2 -translate-y-1/2  opacity-40 text-2xl">
          +
        </span>
        <span className="absolute -top-5 md-custom:-top-6 lg:-top-8 right-0 translate-x-1/2 -translate-y-1/2 opacity-40 text-2xl">
          +
        </span>
        <span className="absolute -bottom-5 md-custom:-bottom-6 lg:-bottom-8 left-0 -translate-x-1/2 translate-y-1/2  opacity-40 text-2xl">
          +
        </span>
        <span className="absolute -bottom-5 md-custom:-bottom-6 lg:-bottom-8 right-0 translate-x-1/2 translate-y-1/2  opacity-40 text-2xl">
          +
        </span>
        <div className="absolute h-px w-[90%] left-1/2 -translate-x-1/2 translate-y-1/2 bg-secondary -bottom-5 md-custom:-bottom-6 lg:-bottom-8" />
        <div className=" projects-pagination absolute  !-bottom-2 lg:!-bottom-4 md-custom:!-bottom-3 translate-y-1/2 self-center !left-1/2 !-translate-x-1/2 flex justify-center" />

        <div
          className="flex absolute left-1/2 -translate-x-1/2 -bottom-12 md-custom:-bottom-12 lg:-bottom-14 w-full translate-y-1/2 items-center justify-between text-secondary"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id ?? active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full flex items-center justify-between"
            >
              <span className="font-bold text-xl">{current?.title ?? "—"}</span>
              <span className="text-xl opacity-80">2025</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <button className="hidden lg:block projects-prev z-40 text-secondary absolute left-[20%] top-1/2 -translate-y-1/2 hover:scale-110 hover:bg-gray-300 rounded-full cursor-pointer transition-all duration-300">
        <span className="sr-only">Prev</span>{" "}
        <svg
          viewBox="0 0 50.79 50.79"
          className="w-8 h-8 transition duration-300 stroke-current rotate-90"
        >
          <g>
            <circle cx="25.39" cy="25.39" r="24.89" fill="none" />
            <g>
              <line x1="25.39" y1="9.37" x2="25.39" y2="39.88" />
              <polyline
                points="38.12 27.47 25.39 40.19 12.67 27.47"
                fill="none"
              />
            </g>
          </g>
        </svg>
      </button>

      <button className="hidden lg:block projects-next z-40 text-secondary absolute right-[20%] top-1/2 -translate-y-1/2 hover:scale-110 hover:bg-gray-300 rounded-full cursor-pointer transition-all duration-300">
        <span className="sr-only">Next</span>{" "}
        <svg
          viewBox="0 0 50.79 50.79"
          className="w-8 h-8 transition duration-300 stroke-current -rotate-90"
        >
          <g>
            <circle cx="25.39" cy="25.39" r="24.89" fill="none" />
            <g>
              <line x1="25.39" y1="9.37" x2="25.39" y2="39.88" />
              <polyline
                points="38.12 27.47 25.39 40.19 12.67 27.47"
                fill="none"
              />
            </g>
          </g>
        </svg>
      </button>
      <Swiper
        modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
        className="w-[90%] md-custom:w-[60%] md-custom:max-h-[50vh] lg:max-h-max lg:w-[55%] 2xl-custom:w-[50%]  !absolute !top-1/2 !left-1/2 !-translate-x-1/2 -translate-y-1/2 swiper-projects"
        centeredSlides={true}
        loop
        loopAdditionalSlides={1}
        effect="coverflow"
        grabCursor
        slidesPerView="auto"
        navigation={{
          nextEl: ".projects-next",
          prevEl: ".projects-prev",
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: "49%",
          depth: 480,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: true,
        }}
        onInit={onInit}
        onSlideChange={onSlideChange}
        pagination={{
          el: ".projects-pagination",
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className}" aria-label="Ir al slide ${index + 1
            }"></span>`,
        }}
      >
        {projects.map((s) => (
          <SwiperSlide
            onClick={() => handleProjectClick(s.id)}
            key={s.id}
            className="!w-[90%] lg:!w-[60%] h-full"
          >
            <div className=" slide-content overflow-hidden h-full">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                className="slide-content-img w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>



      <div
        className="lg:hidden absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: isMd
            ? `calc(30% - (((60vw * 0.506) / 2)))` // md: swiper es 60vw
            : `calc(30% - (((90vw * 0.506) / 2)))`, // mobile: swiper es 90vw
        }}
      >
        <PrimaryButton
          href="/projects"
          className="bg-secondary !px-4 !py-4 text-lg  hover:text-secondary font-bold"
        >
          {t("projects.button")}
        </PrimaryButton>
      </div>

      <div
        className="hidden lg:block absolute  bottom-1/4 left-1/2 -translate-x-1/2 "
        style={{ bottom: `calc(35% - (((60vw * 0.337 ) / 2 )))` }}
      >
        <PrimaryButton
          href="/projects"
          className="bg-secondary font-bold !px-4 !py-4 text-lg text-primary
          hover:bg-secondary/50
          hover:text-secondary"
        >
          {t("projects.button")}
        </PrimaryButton>
      </div>
      {/* <div className="projects-pagination absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-50" /> */}
      <Footer className={"text-secondary"} />
    </section>
  );
};

export default Projects;
