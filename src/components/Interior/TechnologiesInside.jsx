import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import AnimatedBackground from "../Background/AnimatedBackground";
import PrimaryButton from "../buttons/PrimaryButton";
import Header from "../Header";
import Footer from "../Footer";
import technolgies from "../../data/technologies.json";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import { Trans, useTranslation } from "react-i18next";
gsap.registerPlugin(ScrollTrigger, SplitText);

const cards = [
  {
    number: "01",
    description:
      "Design for assembly. Details and interfaces are planned so panels go together fast and clean.",
  },
  {
    number: "02",
    description:
      "Factory precision, field simplicity. Panels arrive labeled with traceable IDs and pass documented quality checks.",
  },
  {
    number: "03",
    description:
      "Clear trade boundaries. Foundations, openings, services, and cladding are pre-scoped to reduce rework.",
  },
  {
    number: "04",
    description:
      "Repeatable on-site sequence. Layout → first lift → lock & align → close-in—calm, predictable sites.",
  },
  {
    number: "05",
    description:
      "Disciplined handover. Complete as-built documentation and closed punchlists.",
  },
];

const StatisticCard = ({ icon, description }) => {
  const { t } = useTranslation();
  return (
    <div className="stat-card relative aspect-[3.5/1] w-full flex px-4 py-4 justify-between">
      <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-secondary opacity-40 text-2xl">
        +
      </span>
      <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-secondary opacity-40 text-2xl">
        +
      </span>
      <span className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-secondary opacity-40 text-2xl">
        +
      </span>
      <span className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-secondary opacity-40 text-2xl">
        +
      </span>
      <img
        src={`/assets/technologies/${icon}`}
        alt={description}
        className=" object-contain h-12 w-12 self-center"
      />
      <p className="text-xs lg:text-base text-secondary self-center max-w-[70%] text-end">
        {description}
      </p>
    </div>
  );
};

const TechnologiesInside = () => {
  const gridRef = useRef(null); // contenedor a medir (absoluto)
  const gridRef2 = useRef(null); // contenedor a medir (absoluto)
  const topRef = useRef(null); // bloque superior (títulos/botones)
  const sectionRef = useRef(null); // sección a la que se aplica minHeight
  const [total_grid, setTotalGrid] = useState(0);
  const [total_grid2, setTotalGrid2] = useState(0);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    let rafId = 0;

    const measure = () => {
      const section = sectionRef.current;
      const gridEl = gridRef.current;
      const gridEl2 = gridRef2.current;

      const gridH = gridEl?.offsetHeight || 0;
      const gridH2 = gridEl2?.offsetHeight || 0;

      // Paddings de la sección
      const cs = getComputedStyle(section);
      const pt = parseFloat(cs.paddingTop) || 0;
      const pb = parseFloat(cs.paddingBottom) || 0;

      // Condición según min-width
      let extra = 0;
      if (window.innerWidth >= 1024) {
        // pantallas grandes (lg+)
        extra = window.innerWidth / 3;
      } else {
        // pantallas menores a lg
        extra = window.innerWidth * 2.8;
      }

      // Altura total deseada
      const total = gridH + extra;

      // Actualiza estado
      setTotalGrid(gridH);
      setTotalGrid2(gridH + extra);

      const min = Math.max(window.innerHeight, total);
      section.style.minHeight = `${min}px`;
    };

    // 1) Primera medición SIN requestAnimationFrame (antes del paint)
    measure();

    // 2) Observa cambios; usa rAF SOLO para consolidar múltiples eventos
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    });
    ro.observe(gridRef.current);
    topRef.current && ro.observe(topRef.current);

    const onWinResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onWinResize);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", onWinResize);
    };
  }, []);
  useLayoutEffect(() => {
    if (!gridRef.current) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(max-width: 1023px)", () => {
        // Offset alrededor del centro (ajusta a gusto)
        const OFFSET = 0.05; // 12% del viewport
        const START = `top center+=${Math.round(OFFSET * 100)}%`;
        const END = `bottom center-=${Math.round(OFFSET * 100)}%`;

        const cards = gsap.utils.toArray(".tech-card");

        cards.forEach((card) => {
          const img = card.querySelector("img");
          const h2 = card.querySelector("h2");
          const para = card.querySelector("p");

          // Estado inicial (equivalente al “no hover”)
          gsap.set(img, {
            opacity: 1,
            scale: 1,
            willChange: "transform,opacity",
          });
          gsap.set([h2, para], {
            opacity: 0,
            scale: 0,
            transformOrigin: "50% 50%",
            willChange: "transform,opacity",
          });

          // Timeline que “reproduce” el hover
          const tl = gsap.timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "none" },
          });
          tl.to(img, { opacity: 0, scale: 10 }, 0) // como group-hover: scale-[1000%] + opacity-0
            .to(h2, { opacity: 1, scale: 1, ease: "none" }, 0.05)
            .to(para, { opacity: 1, scale: 1, ease: "none" }, 0.1);

          // ScrollTrigger: entra → play; sale → reverse (también al volver)
          ScrollTrigger.create({
            trigger: card,
            start: START,
            end: END,
            onEnter: () => tl.play(),
            onEnterBack: () => tl.play(),
            onLeave: () => tl.reverse(),
            onLeaveBack: () => tl.reverse(),
            // Opcional: añade una clase para debugging/estilos
            // toggleClass: { targets: card, className: "is-revealed" },
          });
        });
      });
    }, gridRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // === 1) SplitText en títulos y subtítulos ===
      const splitTargets = gsap.utils.toArray(".reveal-lines");
      const splits = splitTargets.map((el) => {
        const split = new SplitText(el, {
          type: "lines",
          linesClass: "lineWrapper overflow-hidden block",
        });
        const inner = new SplitText(el, { type: "lines" });
        return { wrap: split, inner };
      });

      const introTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      // Títulos/subtítulos por línea
      splits.forEach(({ inner }) => {
        introTl.from(
          inner.lines,
          {
            yPercent: 100,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          "<+=0.1"
        );
      });

      // Botones (top + móvil)
      introTl.from(
        [".top-cta", ".mobile-cta"],
        {
          y: 20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.1,
        },
        "-=0.3"
      );

      // === 2) Trigger global para intro (solo una vez) ===
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => introTl.play(),
      });
    }, sectionRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full pt-32 relative bg-primary z-20 flex flex-col justify-start items-center lg:gap-20"
    >
      <div className=" -z-10 bg-primary mix-blend-screen" />

      <Header className={"!text-secondary is-dark2"} />

      {/* Bloque superior que sí ocupa flujo (medido con topRef) */}
      <div
        ref={topRef}
        className="flex flex-col w-full gap-4 justify-start items-start px-8 pb-20 lg:pb-0 isolate"
      >
        <div className="flex w-full justify-between items-center text-secondary">
          <h1 className="reveal-lines lg:text-5xl text-[2rem] lg:leading-normal leading-10 font-bold">
            {t("technology_inside.title")}
          </h1>
          <PrimaryButton
            href="/investments/#appointment"
            className="top-cta hidden lg:block bg-secondary text-xl !py-3 !px-6 hover:text-secondary text-primary"
          >
            {t("technology_inside.button")}
          </PrimaryButton>
        </div>

        <h2 className="reveal-lines lg:text-xl text-secondary text-left">
          <Trans i18nKey={"technology_inside.subtitle"}>
            <br></br>
          </Trans>
        </h2>

        <PrimaryButton
          href="/investments/#appointment"
          className="mobile-cta bg-secondary mt-6 text-primary lg:hidden"
        >
          {t("technology_inside.button")}
        </PrimaryButton>
      </div>

      {/* Grid absoluto (no ocupa flujo). Lo medimos con gridRef */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 grid-rows-none lg:grid-cols-3 lg:grid-rows-2 w-full lg:gap-x-28 gap-y-20 lg:gap-y-20 items-center justify-center px-8 lg:px-16  pb-16 "
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="tech-card flex group w-full min-h-fit aspect-[4/3] flex-col justify-between items-start gap-4 p-8 text-primary bg-[#131415] relative"
          >
            <span className="absolute -top-8 lg:-top-8 left-0 lg:-left-2 -translate-x-1/2  text-secondary opacity-40 text-2xl z-50">
              +
            </span>
            <span className="absolute -top-8 lg:-top-8 right-0 lg:-right-2 translate-x-1/2 text-secondary opacity-40 text-2xl ">
              +
            </span>
            <span className="absolute -bottom-8 lg:-bottom-8 left-0 lg:-left-2 -translate-x-1/2  text-secondary opacity-40 text-2xl ">
              +
            </span>
            <span className="absolute -bottom-8 lg:-bottom-8 right-0 lg:-right-2 translate-x-1/2  text-secondary opacity-40 text-2xl ">
              +
            </span>
            <div className="absolute overflow-hidden inset-0 z-30 pointer-events-none">
              <img
                className="opacity-100 absolute h-full w-full z-30 object-cover group-hover:scale-[1000%]  group-hover:opacity-0 transition-all duration-700 ease-in-out"
                alt="image"
                src={`assets/technologies/${i + 1}.jpg`}
              />
            </div>
            <h2 className="opacity-0 scale-0 text-6xl font-bold border-b border-primary w-full text-left group-hover:scale-100  group-hover:opacity-100 transition-all duration-700 ease-in-out">
              {card.number}
            </h2>
            <p
              className="opacity-0 scale-0 w-full text-left 
             group-hover:scale-100 group-hover:opacity-100
             transition-all duration-700 ease-in-out 
             text-[clamp(0.9rem,1vw,1.25rem)]"
            >
              {t("technology_cards." + (i + 1) + ".description")}
            </p>
          </div>
        ))}
      </div>


      {/* Roof, Floor, Wall Panles */}
      {/* <div
        style={{ top: total_grid }}
        className="w-auto lg:w-full panel-strip absolute lg:inset-x-0 bottom-20 inset-x-8 flex flex-col gap-8 lg:gap-0 lg:flex-row lg:aspect-[3/1] aspect-[1/3.5]"
      >
        <div className="flex-1 panel-item w-full overflow-hidden relative">
          <img
            className="object-cover absolute inset-0 h-full flex-1"
            src="/assets/technologies/wall.webp"
            alt="Wall Panels Technology"
          />
          <div className="bg-secondary flex flex-col justify-center items-start px-4 absolute w-full py-2 lg:py-0 lg:h-[15%] bottom-0 left-0 lg:border-r lg:border-primary/20">
            <h2 className="text-lg text-primary font-bold">
              {t("panels.wall")}
            </h2>
            <p className="text-sm text-primary/90">{t("panels.wall_desc")}</p>
          </div>
        </div>
        <div className="flex-1 panel-item w-full overflow-hidden relative">
          <img
            className="object-cover absolute inset-0 w-full h-full flex-1"
            src="/assets/technologies/roof.webp"
            alt="Roof Panels Technology"
          />
          <div className="bg-secondary flex justify-center items-start flex-col px-4 absolute w-full py-2 lg:py-0 lg:h-[15%] bottom-0 left-0 lg:border-r lg:border-primary/20">
            <h2 className="text-lg text-primary font-bold">
              {t("panels.roof")}
            </h2>
            <p className="text-sm text-primary/90">{t("panels.roof_desc")}</p>
          </div>
        </div>
        <div className="flex-1 panel-item w-full overflow-hidden relative">
          <img
            className="object-cover absolute inset-0 h-full flex-1"
            src="/assets/technologies/floor.webp"
            alt="Floor Panels Technology"
          />
          <div className="bg-secondary flex justify-center items-start flex-col px-4 absolute w-full py-2 lg:py-0 lg:h-[15%] bottom-0 left-0">
            <h2 className="text-lg text-primary font-bold">
              {t("panels.floor")}
            </h2>
            <p className="text-sm text-primary/90">{t("panels.floor_desc")}</p>
          </div>
        </div>
      </div> */}

      <div
        ref={gridRef2}
        // style={{ top: total_grid }}
        className="stats-grid grid lg:grid-cols-3 lg:grid-rows-3 grid-flow-row lg:gap-y-10 gap-x-40 w-4/5 pt-20"
      >
        {technolgies.map((tech, i) => (
          <StatisticCard
            key={i}
            icon={tech.icon}
            description={t(`technology_statistics.${i + 1}.description`)}
          />
        ))}
      </div>

      {/* Footer sticky (se pegará si existe scroll dentro de la sección) */}
      <div className="sticky bottom-0 left-0 w-full mt-auto">
        <Footer className="text-secondary" />
        <div className="pointer-events-none z-30 w-full h-[15vh] bg-gradient-to-t from-primary from-50% to-transparent" />
      </div>
    </section>
  );
};

export default TechnologiesInside;
