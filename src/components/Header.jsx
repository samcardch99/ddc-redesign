import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import logo_circle from "/assets/svg/logo_circle.svg";
import logo_letters from "/assets/svg/logo_letters.svg";
import logo_circle_white from "/assets/svg/logo_circle_white.svg";
import logo_letters_white from "/assets/svg/logo_letters_white.svg";
import close_menu from "/assets/svg/close_menu.svg";
import HoverAnimatedLink from "./helpers/HoverAnimatedLink";

const Header = ({ className }) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };
  const openMenuRef = useRef(null);
  const menu1 = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenuRef = document.querySelectorAll(".close_menu");
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.5, ease: "power2.out" },
    });

    tl.fromTo(menu1.current, { opacity: 0 }, { opacity: 1 });
    tl.fromTo(
      ".nav_left_items",
      { opacity: 0, translateY: "0.7rem" },
      { opacity: 1, translateY: "0" },
      "<0.01"
    );
    tl.fromTo(".nav_footer", { opacity: 0 }, { opacity: 1 }, "<0.3");
    tl.fromTo(
      ".nav_items",
      { translateY: "180%" },
      { translateY: "0%", stagger: 0.05, duration: 0.4, ease: "power2.inOut" },
      "<"
    );

    // Abrir menú
    openMenuRef.current.addEventListener("click", (e) => {
      e.preventDefault();
      menu1.current.style.display = "flex"; // ⬅️ Mostrar antes de animar
      tl.play();
    });

    // Cerrar menú
    closeMenuRef.forEach((el) => {
      el.addEventListener("click", (e) => {
        tl.reverse();
      });
    });

    // Ocultar cuando termina el reverse
    tl.eventCallback("onReverseComplete", () => {
      menu1.current.style.display = "none";
    });

    let lastScrollY = window.scrollY;
    let isHidden = false; // NUEVO: Estado de si el header está oculto o no

    const header = document.querySelector("#header");

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 600) {
        if (currentScrollY > lastScrollY && !isHidden) {
          // Scroll hacia abajo Y header visible -> lo ocultamos
          gsap.to(header, { y: "-100%", duration: 0.5, ease: "ease" });
          isHidden = true;
        } else if (currentScrollY < lastScrollY && isHidden) {
          // Scroll hacia arriba Y header oculto -> lo mostramos
          gsap.to(header, { y: 0, duration: 0.5, ease: "ease" });
          isHidden = false;
        }
      } else {
        // Menos de 600px de scroll, siempre visible si estaba oculto
        if (isHidden) {
          gsap.to(header, { y: 0, duration: 0.3, ease: "power2.out" });
          isHidden = false;
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>

      <header
        id="header"
        className={`${className} w-full h-auto fixed top-0 left-0 grid grid-cols-3 items-center p-8 z-50 backdrop-blur-sm  [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
              [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]`}
      >
        {/* Logo izquierdo */}
        <a className="cursor-pointer justify-self-start">
          <span className="sr-only">Home</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 241.85 19.19"
            className="hidden lg:block h-4 w-auto text-white transition-colors duration-300 "
            fill="currentColor"
          >
            <g>
              <path d="M12.94,2.81c1.5,1.63,2.27,3.93,2.27,6.84s-.77,5.2-2.27,6.86c-1.51,1.63-3.62,2.45-6.33,2.45H0V.33H6.61c2.7,0,4.85,.82,6.33,2.48Zm-1.25,12.53c1.15-1.38,1.73-3.27,1.73-5.69s-.59-4.34-1.76-5.69c-1.15-1.35-2.83-2.04-5.05-2.04H1.76v15.49H6.61c2.22,0,3.93-.69,5.08-2.07Z" />
              <path d="M30.51,2.81c1.5,1.63,2.27,3.93,2.27,6.84s-.77,5.2-2.27,6.86c-1.51,1.63-3.62,2.45-6.33,2.45h-6.61V.33h6.61c2.7,0,4.85,.82,6.33,2.48Zm-1.25,12.53c1.15-1.38,1.74-3.27,1.74-5.69s-.59-4.34-1.76-5.69c-1.15-1.35-2.83-2.04-5.05-2.04h-4.85v15.49h4.85c2.22,0,3.93-.69,5.08-2.07Z" />
              <path d="M39.06,17.99c-1.33-.79-2.3-1.91-2.96-3.34-.66-1.43-1-3.09-1-5.03,0-2.93,.77-5.28,2.27-7.02C38.91,.89,41.02,.03,43.73,.03c2.09,0,3.85,.54,5.28,1.61,1.4,1.07,2.4,2.58,2.93,4.49l-1.28,.33c-.13,.05-.43,.13-.43,.13,0,0-.13-.33-.18-.46-.48-1.4-1.28-2.53-2.35-3.32-1.07-.79-2.4-1.2-3.98-1.2-2.22,0-3.9,.71-5.05,2.17-1.17,1.43-1.76,3.39-1.76,5.84,0,.74,.08,1.43,.18,2.12,.13,.69,.33,1.4,.66,2.14,.31,.74,.71,1.38,1.2,1.91,.48,.54,1.15,.97,1.96,1.3,.82,.36,1.76,.54,2.81,.54,1.68,0,3.09-.43,4.18-1.33,1.1-.87,1.86-2.07,2.25-3.6,.05-.15,.13-.54,.13-.54,0,0,.38,.1,.54,.15l1.25,.31c-.48,2.07-1.45,3.67-2.91,4.82-1.45,1.17-3.27,1.74-5.43,1.74-1.81,0-3.37-.38-4.67-1.2Z" />
              <path d="M72.58,2.81c1.5,1.63,2.27,3.93,2.27,6.84s-.77,5.2-2.27,6.86c-1.51,1.63-3.62,2.45-6.33,2.45h-6.61V.33h6.61c2.7,0,4.85,.82,6.33,2.48Zm-1.25,12.53c1.15-1.38,1.73-3.27,1.73-5.69s-.59-4.34-1.76-5.69c-1.15-1.35-2.83-2.04-5.05-2.04h-4.85v15.49h4.85c2.22,0,3.93-.69,5.08-2.07Z" />
              <path d="M78.19,1.91v6.68h9.39v1.58h-9.39v7.22h9.59v1.56h-11.35V.33h11.35V1.91h-9.59Z" />
              <path d="M103.86,.36l-6.63,18.6h-1.91L88.78,.36h1.96l5.56,16L101.97,.36h1.89Z" />
              <path d="M107.35,1.91v6.68h9.39v1.58h-9.39v7.22h9.59v1.56h-11.35V.33h11.35V1.91h-9.59Z" />
              <path d="M130.44,17.4v1.56h-11.35V.36h1.79V17.4h9.57Z" />
              <path d="M131.41,16.58c-1.5-1.74-2.27-4.06-2.27-6.99s.77-5.28,2.27-7.02c1.53-1.73,3.65-2.58,6.38-2.58s4.82,.84,6.35,2.58c1.51,1.71,2.25,4.06,2.25,7.02s-.74,5.31-2.27,7.02c-1.5,1.71-3.62,2.58-6.33,2.58s-4.87-.87-6.38-2.6Zm11.46-1.12c1.17-1.46,1.74-3.39,1.74-5.87s-.56-4.44-1.74-5.87-2.86-2.14-5.08-2.14-3.9,.71-5.08,2.17c-1.17,1.43-1.76,3.39-1.76,5.84,0,2.32,.59,4.54,2.04,6.17,1.2,1.33,3.11,1.86,4.8,1.86,2.22,0,3.9-.74,5.08-2.17Z" />
              <path d="M160.01,1.71c1.07,.89,1.58,2.17,1.58,3.83s-.51,2.93-1.58,3.83c-1.07,.92-2.55,1.35-4.52,1.35h-4.75v8.24h-1.79V.36h6.53c1.96,0,3.44,.43,4.52,1.35Zm-1.33,6.48c.74-.61,1.12-1.51,1.12-2.65s-.38-2.04-1.12-2.65c-.77-.64-1.84-.94-3.21-.94h-4.72v7.19h4.72c1.38,0,2.45-.31,3.21-.94Z" />
              <path d="M180.67,18.96h-1.79V3.85l-6,15.1h-1.86l-5.97-15.05v15.05h-1.79V.36h2.35l6.35,16.33L178.45,.36h2.22V18.96Z" />
              <path d="M185.24,1.91v6.68h9.39v1.58h-9.39v7.22h9.59v1.56h-11.35V.33h11.35V1.91h-9.59Z" />
              <path d="M211.11,.36V18.96h-1.99l-10.36-15.87v15.87h-1.79V.36h1.96l10.38,15.89V.36h1.79Z" />
              <path d="M226.39,1.94h-5.71V18.96h-1.79V1.94h-5.74V.36h13.24V1.94Z" />
              <path d="M230.83,18.55c-1.1-.41-2.12-1.04-3.01-1.91l1.17-1.25,.36,.31c1.5,1.28,3.32,1.94,5.41,1.94,1.66,0,2.96-.38,3.9-1.1,.92-.71,1.4-1.66,1.4-2.78,0-.87-.36-1.61-1.02-2.27-.69-.66-1.68-1.15-3.04-1.43l-2.81-.61c-3.32-.71-4.97-2.27-4.97-4.67,0-1.58,.56-2.75,1.71-3.57,1.15-.79,2.7-1.2,4.69-1.2,.77,0,1.5,.08,2.19,.25,.71,.15,1.33,.38,1.86,.66,.51,.28,.97,.54,1.35,.82,.36,.26,.69,.54,.99,.82l-1.15,1.22s-.28-.23-.38-.31c-1.66-1.25-3.29-1.89-4.87-1.89s-2.68,.25-3.47,.82c-.77,.54-1.17,1.33-1.17,2.37,0,.69,.31,1.3,.87,1.84,.59,.54,1.4,.92,2.48,1.15l2.91,.69c1.91,.43,3.32,1.07,4.26,1.94,.92,.87,1.35,1.99,1.35,3.34,0,1.81-.61,3.16-1.86,4.08-1.28,.92-3.01,1.38-5.23,1.38-1.51,0-2.83-.21-3.93-.64Z" />
            </g>
          </svg>

          <button className="font-light lg:hidden" onClick={toggleLanguage}>
            <span className="font-bold">EN</span> | ES
          </button>
        </a>

        {/* Logo central */}
        <a href="/" className="cursor-pointer justify-self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 57.01 57.01"
            width="3rem"
            className="text-white transition-colors duration-300" // ⬅️ cambia dinámicamente con text-*
            fill="currentColor"
          >
            <g>
              <path d="M28.51,57.01C12.79,57.01,0,44.22,0,28.51S12.79,0,28.51,0s28.51,12.79,28.51,28.51-12.79,28.51-28.51,28.51Zm0-54.51C14.17,2.51,2.51,14.17,2.51,28.51s11.66,26,26,26,26-11.66,26-26S42.84,2.51,28.51,2.51Z" />
              <path d="M39.66,41.73c-7.74,0-13.58-5.69-13.58-13.22s5.85-13.22,13.62-13.22c3.9,0,7.28,1.35,9.52,3.81l-.76,.69c-2.04-2.24-5.16-3.48-8.76-3.48-7.3,0-12.6,5.13-12.6,12.2s5.28,12.2,12.56,12.2c3.61,0,6.74-1.25,8.8-3.51l.76,.69c-2.26,2.48-5.65,3.85-9.56,3.85Z" />
              <path d="M39.54,40.92c-7.27,0-12.75-5.34-12.75-12.41s5.49-12.41,12.78-12.41c3.66,0,6.83,1.27,8.93,3.58l-.71,.65c-1.92-2.1-4.84-3.26-8.22-3.26-6.85,0-11.82,4.82-11.82,11.45s4.96,11.45,11.79,11.45c3.39,0,6.32-1.17,8.26-3.3l.71,.65c-2.12,2.33-5.31,3.61-8.97,3.61Z" />
              <path d="M20.95,41.73H10.09V15.28h10.86c8.32,0,14.13,5.44,14.13,13.22s-5.81,13.22-14.13,13.22Zm-9.19-1.72h9.28c7.4,0,12.36-4.62,12.36-11.51s-4.97-11.51-12.36-11.51H11.76v23.01Z" />
              <path d="M28.95,41.73h-10.86V15.28h10.86c8.32,0,14.13,5.44,14.13,13.22s-5.81,13.22-14.13,13.22Zm-9.19-1.72h9.28c7.4,0,12.36-4.62,12.36-11.51s-4.97-11.51-12.36-11.51h-9.28v23.01Z" />
            </g>
          </svg>
        </a>

        {/* Menú derecho */}
        <div className="flex gap-10 justify-self-end items-center ">
          <button className="hidden lg:block" onClick={toggleLanguage}>
            <span
              className={`${t.language === "en" ? "font-bold" : "font-thin"}`}
            >
              English
            </span>{" "}
            |{" "}
            <span
              className={`${t.language === "es" ? "font-bold" : "font-thin"}`}
            >
              Spanish
            </span>
          </button>
          <button
            ref={openMenuRef}
            className="font-bold text-lg bg-transparent lg:hover:text-primary/65 transition-colors duration-200"
          >
            <span className="sr-only">Menu</span>
            <svg
              height="2rem"
              width="2rem"
              viewBox="0 0 32 32"
              fill="currentColor"
              className="transition-colors lg:hidden"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
            </svg>
            <span className="hidden lg:block">Menu</span>
          </button>
        </div>
      </header>
      <div
        ref={menu1}
        className="hidden opacity-0 h-[100dvh] w-full bg-dark_blue bg-opacity-[0.98] backdrop-blur-xl bg-secondary/85 fixed top-0 left-0 z-[500] text-white_gray"
      >
        <header className="absolute left-0 top-0 py-8 lg:py-12 px-8  w-full flex items-center">
          <img
            className="sm:block hidden h-4"
            alt="logo_letters"
            src="/assets/svg/logo_letters_white.svg"
          />

          <img
            src="/assets/svg/logo_circle_white.svg"
            alt="logo_circle"
            className="h-12 sm:hidden"
          />
          <span className="close_btn cursor-pointer absolute pt-8 px-6 top-0 right-0">
            <img
              className="h-8 close_menu"
              alt="logo_letters"
              src="/assets/svg/close_menu.svg"
            />
          </span>
        </header>
        <div className="nav_left_items hidden md:flex md:flex-col justify-between items-center absolute bottom-14 w-fit p-6 lg:p-0  md:top-1/4 md:left-[20%] lg:left-1/4 md:bottom-1/4 md:pt-[0.6rem]">
          <img
            src="/assets/svg/logo_circle_white.svg"
            alt="logo_circle"
            className="h-28 hidden sm:block"
          />

          <nav className="text-xl lg:mb-[0.87rem]">
            <ul className="leading-relaxed">
              <li>
                <a
                  className="hover-underline-animation left after:bg-white_gray"
                  href="https://www.instagram.com/ddc.developments"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="hover-underline-animation left after:bg-white_gray"
                  href="https://www.youtube.com/@DDC.Developments"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  className="hover-underline-animation left after:bg-white_gray"
                  href="https://theddcway.com"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <nav className="absolute top-1/4 bottom-1/4 lg:right-1/4 right-6 text-5xl">
          <div className="flex flex-col h-full justify-between lg:items-start items-end">
            <div className="overflow-hidden">
              <div className="nav_items">
                <HoverAnimatedLink
                  text={t("main_menu.home")}
                  smooth
                  href="/"
                  className="close_menu"
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="nav_items">
                <HoverAnimatedLink
                  text={t("main_menu.team")}
                  smooth
                  href="/team"
                  className="close_menu"
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="nav_items">
                <HoverAnimatedLink
                  text={t("main_menu.investments")}
                  href={"/investments"}
                  className="close_menu"
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="nav_items">
                <HoverAnimatedLink
                  text={t("main_menu.projects")}
                  smooth
                  href="/projects"
                  className="close_menu"
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="nav_items">
                <HoverAnimatedLink
                  text={t("main_menu.technologies")}
                  smooth
                  href="/technologies"
                  className="close_menu"
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="nav_items">
                <HoverAnimatedLink
                  text={t("main_menu.contact")}
                  href="/#contact"
                  className="close_menu"
                />
              </div>
            </div>
          </div>
        </nav>
        <footer className="nav_footer absolute bottom-0 w-full flex justify-between p-6 lg:p-2 items-center lg:text-xl tracking-[0.2]">
          <div className="flex lg:gap-4 w-full lg:w-auto justify-between items-end">
            <a
              className="hover-underline-animation left after:bg-white_gray"
              href="/privacy-policy"
              target="_blank"
            >
              {t("footer.privacyPolicy")}
            </a>

            <div className="flex flex-col gap-12 items-center justify-end">
              <div className="nav_left_items lg:hidden flex flex-col items-end text-end justify-end  w-full p-0  pt-[0.6rem]">
                <nav className="text-base">
                  <ul className="leading-loose">
                    <li>
                      <a
                        className="hover-underline-animation left after:bg-white_gray"
                        href="https://www.instagram.com/ddc.developments"
                      >
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a
                        className="hover-underline-animation left after:bg-white_gray"
                        href="https://www.youtube.com/@DDC.Developments"
                      >
                        Youtube
                      </a>
                    </li>
                    <li>
                      <a
                        className="hover-underline-animation left after:bg-white_gray"
                        href="https://theddcway.com"
                      >
                        Portfolio
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <a
            className="!hidden lg:!block hover-underline-animation left after:bg-white_gray"
            href="mailto:info@ddcdevelopments.com"
          >
            info@ddcdevelopments.com
          </a>
        </footer>
      </div>
    </>
  )
}

export default Header;
