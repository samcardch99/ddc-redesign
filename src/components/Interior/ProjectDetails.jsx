import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import AnimatedBackground from "../Background/AnimatedBackground";
import Footer from "../Footer";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Header from "../Header";
import projects from "../../data/villas.json";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

// ===== Variantes framer-motion (suaves y elegantes) =====
const easeOutExpo = [0.22, 1, 0.36, 1];

const pageV = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const heroGroupV = {
  hidden: {},
  visible: {
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeUpV = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

const gridV = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
      when: "beforeChildren",
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const cardV = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [matchMode, setMatchMode] = useState("contains");
  const [view, setView] = useState("grid");
  const [location, setLocation] = useState("All");
  const [photoMode, setPhotoMode] = useState(() => {
    try { return localStorage.getItem(`photoMode_${projectId}`) || "renders"; } catch { return "renders"; }
  });
  const { t } = useTranslation();
  const project = useMemo(
    () => projects.find((p) => p.folder === projectId) ?? null,
    [projectId]
  );

  // Al cambiar de proyecto, cargar el modo guardado (o "renders" por defecto)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`photoMode_${projectId}`);
      setPhotoMode(saved || "renders");
    } catch {
      setPhotoMode("renders");
    }
    window.scrollTo(0, 0);
  }, [projectId, pathname]);

  // Persistir selección en localStorage cada vez que cambia
  useEffect(() => {
    try { localStorage.setItem(`photoMode_${projectId}`, photoMode); } catch {}
  }, [photoMode, projectId]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [view, location, matchMode, query]);

  const firstMountRef = useRef(true);
  useEffect(() => {
    firstMountRef.current = false;
  }, []);

  const normalized = useMemo(
    () => projects.map((p) => ({ ...p, location: p.city })),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalized.filter((p) => {
      const title = p.name.toLowerCase();
      const nameOk =
        q.length === 0
          ? true
          : matchMode === "exact"
            ? title === q
            : title.includes(q);
      const locOk = location === "All" ? true : p.location === location;
      return nameOk && locOk;
    });
  }, [normalized, query, matchMode, location]);

  const [isLg, setIsLg] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsLg(e.matches);
    setIsLg(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!project) return <div className="loading">Loading Project...</div>;

  return (
    <>
      <Helmet>
        <title>{project.name}</title>
      </Helmet>

      {/* ===== Página completa: fade-in suave ===== */}
      <section
        id="project-details"
        className="relative z-20 min-h-screen w-full flex flex-col gap-16 pt-24 bg-primary"
      >
        <div className="absolute inset-0 -z-10 bg-black opacity-80" />
        <AnimatedBackground />
        <Header className={"is-clear"} />

        {/* ===== HERO (título + meta + descripción) con stagger ===== */}
        <motion.div
          className="relative"
          variants={heroGroupV}
          initial="hidden"
          animate="visible"
        >
          <div className="px-8 mb-6">
            <div className="flex flex-col w-full items-start">
              <motion.h1
                variants={fadeUpV}
                className="text-4xl font-bold text-primary mb-2"
              >
                {project.name}
              </motion.h1>

              <motion.h2
                variants={fadeUpV}
                className="font-bold text-sm lg:text-lg text-primary/80"
              >
                {project.address}
              </motion.h2>

              <motion.h2
                variants={fadeUpV}
                className="font-semibold text-sm lg:text-lg mb-4 text-primary/80"
              >
                {project.areas_info ? (
                  <span>
                    {" "}
                    {t(
                      `project_details.project_description.${project.folder}.areas_info`
                    )}{" "}
                  </span>
                ) : (
                  <>
                    <span>{project.bedrooms} </span>
                    <span>{t("project_details.bedrooms")}</span>
                    <span> ● </span>
                    <span>{project.bathrooms}</span>
                    <span> {t("project_details.bathrooms")}</span>
                  </>
                )}
              </motion.h2>

              <motion.p
                variants={fadeUpV}
                className="text-xs lg:text-lg lg:w-3/5"
              >
                {t(
                  `project_details.project_description.${project.folder}.description`
                )}
              </motion.p>

              {/* Toggle Renders / Reales — solo si el proyecto tiene fotos reales */}
              {project.total_real_images && (
                <motion.div
                  variants={fadeUpV}
                  className="w-full flex justify-end mt-4"
                >
                  <div className="flex items-center gap-2 text-white">
                    <button
                      type="button"
                      onClick={() => setPhotoMode("renders")}
                      className={`flex items-center gap-1.5 py-1 rounded-lg text-sm font-semibold transition-colors ${
                        photoMode === "renders" ? "text-primary" : "text-grey/50 hover:bg-white/20"
                      }`}
                    >
                      {/* Cubo 3D — evoca render/perspectiva */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      {t("project_details.renders")}
                    </button>
                    <span className="text-primary/50">/</span>
                    <button
                      type="button"
                      onClick={() => setPhotoMode("reales")}
                      className={`flex items-center gap-1.5 py-1 rounded-lg text-sm font-semibold transition-colors ${
                        photoMode === "reales" ? "text-primary" : "text-grey/50 hover:bg-white/20"
                      }`}
                    >
                      {/* Cámara — fotos reales */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      {t("project_details.reales")}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ===== GRID: aparece después y anima cada tarjeta con stagger ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${project.folder}-${photoMode}`}
            variants={gridV}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            className="px-8 pb-32 min-h-screen"
          >
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              <PhotoProvider>
                {[...Array(photoMode === "reales" ? project.total_real_images : project.total_images)].map((_, index) => {
                  const isRightEdgeLg = isLg && (index + 1) % 3 === 0;
                  const src = photoMode === "reales"
                    ? `/assets/images/${project.folder}/Reales/${index + 1}.jpg`
                    : `/assets/images/${project.folder}/${index + 1}.jpeg`;

                  return (
                    <motion.article
                      layout
                      key={`${project.folder}-${photoMode}-${index}`}
                      variants={cardV}
                      initial="hidden"
                      animate="visible"
                      className="group aspect-video p-3 relative cursor-pointer"
                    >
                      <span
                        className={`${isLg && "hidden"
                          } left-span absolute -bottom-8 lg:-bottom-4 left-0 lg:-left-5 -translate-x-1/2 text-primary opacity-40 text-2xl`}
                      >
                        +
                      </span>

                      <span
                        className={`right-span absolute -bottom-8 lg:-bottom-8 right-0 lg:-right-5 translate-x-1/2 text-primary opacity-40 text-2xl ${isRightEdgeLg ? "no-sign" : ""
                          }`}
                      >
                        +
                      </span>

                      <div className="overflow-hidden shadow-[0_18px_35px_-10px_rgba(0,0,0,.45)]">
                        <PhotoView src={src}>
                          <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="h-[180px] sm:h-[200px] md:h-[220px] lg:aspect-video lg:h-full w-full object-contain"
                          />
                        </PhotoView>
                      </div>
                    </motion.article>
                  );
                })}
              </PhotoProvider>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ===== Footer: fade-in breve ===== */}
        <motion.div
          className="sticky inset-x-0 bottom-0 mix-blend-difference"
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: { duration: 0.45, ease: easeOutExpo },
          }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <Footer className={""} />
        </motion.div>
      </section>
    </>
  );
}
