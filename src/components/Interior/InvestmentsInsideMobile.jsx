import React, { useEffect, useRef, useState, useMemo } from "react";
import items from "../../data/investments.json";
import { InvestmentCard } from "../helpers/InvestmentCard";
import AnimatedBackground from "../Background/AnimatedBackground";
import Header from "../Header";
import LeadConnectorWidget from "../../Form/LeadConnectorWidget";

// ✅ Validación + envío + Select + Countries
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Select from "react-select";
import { useTranslation } from "react-i18next";

// Configuración de países
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(es);
countries.registerLocale(en);

function InvestmentDialog({ open, onClose, investmentTitle }) {
  const panelRef = useRef(null);
  const { t, i18n } = useTranslation();

  // Generar lista de países dinámicamente según el idioma
  const countryOptions = useMemo(() => {
    const lang = i18n.language.startsWith("es") ? "es" : "en";
    const list = countries.getNames(lang, { select: "official" });
    return Object.entries(list)
      .map(([code, name]) => ({ value: code, label: name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [i18n.language]);

  const dialogSchema = z.object({
    name: z
      .string()
      .min(2, t("investments_inside.form.validation.name"))
      .max(80, "Nombre demasiado largo"),
    email: z
      .string()
      .email(t("investments_inside.form.validation.email.invalid"))
      .min(3, t("investments_inside.form.validation.email.required")),
    phone: z
      .string()
      .regex(/^[0-9+()\-\s]{7,20}$/, t("investments_inside.form.validation.phone")),
    country: z
      .object(
        { value: z.string(), label: z.string() },
        { required_error: t("investments_inside.form.validation.select") }
      )
      .nullable()
      .refine((val) => val !== null, t("investments_inside.form.validation.select")),
    budget: z.string().min(1, t("investments_inside.form.validation.select")),
    funds: z.string().min(1, t("investments_inside.form.validation.select")),
    company: z.string().min(1, t("investments_inside.form.validation.select")),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dialogSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: null,
      budget: "",
      funds: "",
      company: "",
    },
  });

  // Estilos personalizados para React-Select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      // Cambiado a secondary/40 para que coincida con tus otros inputs
      borderColor: state.isFocused ? "#0f1931" : "rgb(15 25 49 / 0.4)",
      borderRadius: "0",
      padding: " 0.75rem", // Un poco más de padding para igualar altura de inputs
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: "rgb(15 25 49 / 0.4)",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1E1F20", // Fondo oscuro para el desplegable
      borderRadius: "0",
      zIndex: 1000,
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "rgba(255, 255, 255, 0.2)"
        : state.isFocused
          ? "rgba(255, 255, 255, 0.1)"
          : "transparent",
      color: "#FFFFFF", // Texto de las opciones siempre blanco
      cursor: "pointer",
      fontSize: "0.875rem",
      "&:active": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#0f1931", // Color del texto seleccionado
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "#0f1931", // Color del texto mientras escribes
    }),
    placeholder: (base) => ({
      ...base,
      color: "#0f1931", // Color del texto "Selecciona tu país"
      fontSize: "0.875rem",
      textTransform: "none", // Evita que el placeholder herede mayúsculas si no quieres
    }),
    // Ajuste opcional para los iconos de la derecha
    dropdownIndicator: (base) => ({
      ...base,
      color: "rgb(15 25 49 / 0.4)",
      "&:hover": { color: "#0f1931 " }
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "rgb(15 25 49 / 0.4)",
    }),
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data) => {
    const templateParams = {
      from_name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country.label,
      investment_title: investmentTitle,
      budget: data.budget,
      funds: data.funds,
      company: data.company,
      source: "investments_inside_mobile_dialog",
    };

    try {
      await fetch(
        "https://services.leadconnectorhq.com/hooks/7oU5lsceedkFIPHBdU4t/webhook-trigger/88dfb46e-d9cd-4d8b-84c9-98fe4e2ea450",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateParams),
        }
      );

      const phoneNumber = "17865661632";
      const message = `
Hola, me gustaría recibir más información.
📌 *Datos:*
- Nombre: ${data.name}
- País: ${data.country.label}
- Email: ${data.email}
- Teléfono: ${data.phone}
- Proyecto: ${investmentTitle}
      `.trim();

      window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      onClose?.();
      reset();
    } catch (error) {
      toast.error(t("form_send.fail_title"));
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center h-full bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      data-lenis-prevent
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[92vw] max-w-[520px] max-h-[90vh] overflow-y-auto bg-primary text-secondary p-6 sm:p-8 shadow-2xl rounded-none"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 grid place-items-center text-secondary/80 hover:text-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-semibold tracking-tight">
          {t("investments_inside.form.title")}
        </h3>
        <p className="mt-1 text-sm opacity-80">
          {t("investments_inside.form.subtitle")} <span className="font-medium">{investmentTitle}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase opacity-80">{t("investments_inside.form.name")}</label>
            <input
              {...register("name")}
              className="w-full bg-transparent text-secondary p-3 border border-secondary/40 focus:border-secondary outline-none rounded-none"
              placeholder={t("investments_inside.form.name_placeholder")}
            />
            {errors.name && <span className="text-rose-400 text-xs">{errors.name.message}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase opacity-80">{t("investments_inside.form.mail")}</label>
            <input
              type="email"
              {...register("email")}
              className="w-full bg-transparent text-secondary p-3 border border-secondary/40 focus:border-secondary outline-none rounded-none"
              placeholder={t("investments_inside.form.mail_placeholder")}
            />
            {errors.email && <span className="text-rose-400 text-xs">{errors.email.message}</span>}
          </div>

          {/* País */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase opacity-80">
              {t("investments_inside.form.country") || "País de residencia"}
            </label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  styles={selectStyles}
                  placeholder={t("investments_inside.form.country_placeholder") || "Selecciona tu país"}
                  isSearchable={true}
                />
              )}
            />
            {errors.country && <span className="text-rose-400 text-xs">{errors.country.message}</span>}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase opacity-80">{t("investments_inside.form.phone")}</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full bg-transparent text-secondary p-3 border border-secondary/40 focus:border-secondary outline-none rounded-none"
              placeholder={t("investments_inside.form.phone_placeholder")}
            />
            {errors.phone && <span className="text-rose-400 text-xs">{errors.phone.message}</span>}
          </div>

          {/* Radios: Presupuesto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("investments_inside.form.first_select")}</label>
            <div className="flex flex-col gap-1">
              {["$200,000 – $300,000", "$300,000 – $500,000", t("investments_inside.form.first_select_3")].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={opt} {...register("budget")} className="accent-secondary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.budget && <span className="text-rose-400 text-xs">{errors.budget.message}</span>}
          </div>

          {/* Radios: Fondos */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("investments_inside.form.second_select")}</label>
            <div className="flex flex-col gap-1">
              {[t("investments_inside.form.second_select_1"), t("investments_inside.form.second_select_2"), t("investments_inside.form.second_select_3")].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={opt} {...register("funds")} className="accent-secondary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.funds && <span className="text-rose-400 text-xs">{errors.funds.message}</span>}
          </div>

          {/* Radios: Empresa */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("investments_inside.form.third_select")}</label>
            <div className="flex flex-col gap-1">
              {[t("investments_inside.form.third_select_1"), t("investments_inside.form.third_select_2"), t("investments_inside.form.third_select_3")].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={opt} {...register("company")} className="accent-secondary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.company && <span className="text-rose-400 text-xs">{errors.company.message}</span>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#1E1F20] rounded-full text-primary ring-1 ring-white/20 hover:bg-secondary/20 hover:text-secondary transition-all disabled:opacity-60 w-full sm:w-auto"
            >
              {isSubmitting ? t("investments_inside.form.button_sending") : t("investments_inside.form.button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------- Componente principal -------------------- */
const InvestmentsInsideMobile = () => {
  const [open, setOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const { t } = useTranslation();

  const handleOpen = (title) => {
    setSelectedTitle(title);
    setOpen(true);
  };

  return (
    <section className="min-h-screen h-auto w-full px-8 pb-20 pt-32 flex flex-col gap-16 bg-primary relative z-20">
      <div className="absolute inset-0 -z-10 bg-black/80" />
      <AnimatedBackground />
      <Header className={"is-clear"} />

      <img
        src="/assets/investments/investment_map_mobile.png"
        alt="investment map mobile"
        className="w-full h-auto object-contain"
      />

      <div className="flex flex-col justify-center items-center gap-8">
        <h2 className="text-5xl font-bold self-start">
          {t("investments_inside.card.title")}
        </h2>
        {items.map((card, i) => (
          <InvestmentCard
            key={i}
            title={card.title}
            asset_type={t(`investments_inside.card.content.${i + 1}.active`)}
            construction_term={t(`investments_inside.card.content.${i + 1}.time`)}
            investor_profile={t(`investments_inside.card.content.${i + 1}.profile`)}
            onAction={() => handleOpen(card.title)}
          />
        ))}
      </div>

      <LeadConnectorWidget className=" " />

      <InvestmentDialog
        open={open}
        onClose={() => setOpen(false)}
        investmentTitle={selectedTitle}
      />
    </section>
  );
};

export default InvestmentsInsideMobile;