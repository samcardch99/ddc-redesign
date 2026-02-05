import { useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Select from "react-select";

// Importación y registro de base de datos de países
import countries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(es);
countries.registerLocale(en);

export function InvestmentDialog({ open, onClose, investmentTitle }) {
  const panelRef = useRef(null);
  const { t, i18n } = useTranslation();

  // Generar lista de países dinámicamente según el idioma actual del sitio
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
    // Validación de objeto para React-Select
    country: z
      .object(
        {
          value: z.string(),
          label: z.string(),
        },
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

  // Estilos personalizados para React-Select (Tema oscuro/minimalista)
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "white" : "rgba(255,255,255,0.4)",
      borderRadius: "0",
      padding: "2px",
      color: "white",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": { borderColor: "white" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1E1F20",
      borderRadius: "0",
      zIndex: 1000,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "rgba(255,255,255,0.1)" : "transparent",
      color: "white",
      cursor: "pointer",
      "&:active": { backgroundColor: "rgba(255,255,255,0.2)" },
    }),
    singleValue: (base) => ({ ...base, color: "white" }),
    input: (base) => ({ ...base, color: "white" }),
    placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.5)", fontSize: "1rem" }),
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
      budget: data.budget,
      funds: data.funds,
      company: data.company,
      source: "investments_inside1_dialog",
    };

    try {
      // 1. Envío al Webhook de LeadConnector
      await fetch(
        "https://services.leadconnectorhq.com/hooks/7oU5lsceedkFIPHBdU4t/webhook-trigger/88dfb46e-d9cd-4d8b-84c9-98fe4e2ea450",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateParams),
        }
      );

      // 2. Redirección a WhatsApp con los datos codificados
      const phoneNumber = "17865661632";
      const message = `
Hola, me gustaría recibir más información sobre inversiones.

📌 *Datos proporcionados:*
- Nombre: ${data.name}
- País: ${data.country.label}
- Email: ${data.email}
- Teléfono: ${data.phone}
- Presupuesto estimado: ${data.budget}
- Fondos disponibles: ${data.funds}
- Empresa registrada en US: ${data.company}
      `.trim();

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappURL;

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
        {/* Botón Cerrar */}
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
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-secondary"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-semibold tracking-tight">
          {t("investments_inside.form.title")}
        </h3>
        <p className="mt-1 text-sm opacity-80">
          {t("investments_inside.form.subtitle")}{" "}
          <span className="font-medium">{investmentTitle}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs uppercase tracking-wide opacity-80">
              {t("investments_inside.form.name")}
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full bg-transparent text-secondary p-3 border border-secondary/40 focus:border-secondary outline-none rounded-none"
              placeholder={t("investments_inside.form.name_placeholder")}
              autoFocus
            />
            {errors.name && (
              <span className="text-rose-400 text-xs">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase tracking-wide opacity-80">
              {t("investments_inside.form.mail")}
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full bg-transparent text-secondary p-3 border border-secondary/40 focus:border-secondary outline-none rounded-none"
              placeholder={t("investments_inside.form.mail_placeholder")}
            />
            {errors.email && (
              <span className="text-rose-400 text-xs">{errors.email.message}</span>
            )}
          </div>

          {/* País (Nuevo Campo) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide opacity-80">
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
                  noOptionsMessage={() => "No se encontraron resultados"}
                />
              )}
            />
            {errors.country && (
              <span className="text-rose-400 text-xs">{errors.country.message}</span>
            )}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs uppercase tracking-wide opacity-80">
              {t("investments_inside.form.phone")}
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full bg-transparent text-secondary p-3 border border-secondary/40 focus:border-secondary outline-none rounded-none"
              placeholder={t("investments_inside.form.phone_placeholder")}
            />
            {errors.phone && (
              <span className="text-rose-400 text-xs">{errors.phone.message}</span>
            )}
          </div>

          {/* Pregunta 1: Presupuesto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {t("investments_inside.form.first_select")}
            </label>
            <div className="flex flex-col gap-1">
              {[
                "$200,000 – $300,000",
                "$300,000 – $500,000",
                t("investments_inside.form.first_select_3"),
              ].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                  <input type="radio" value={opt} {...register("budget")} className="accent-secondary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.budget && (
              <span className="text-rose-400 text-xs">{errors.budget.message}</span>
            )}
          </div>

          {/* Pregunta 2: Fondos */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {t("investments_inside.form.second_select")}
            </label>
            <div className="flex flex-col gap-1">
              {[
                t("investments_inside.form.second_select_1"),
                t("investments_inside.form.second_select_2"),
                t("investments_inside.form.second_select_3"),
              ].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                  <input type="radio" value={opt} {...register("funds")} className="accent-secondary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.funds && (
              <span className="text-rose-400 text-xs">{errors.funds.message}</span>
            )}
          </div>

          {/* Pregunta 3: Empresa */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {t("investments_inside.form.third_select")}
            </label>
            <div className="flex flex-col gap-1">
              {[
                t("investments_inside.form.third_select_1"),
                t("investments_inside.form.third_select_2"),
                t("investments_inside.form.third_select_3"),
              ].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                  <input type="radio" value={opt} {...register("company")} className="accent-secondary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {errors.company && (
              <span className="text-rose-400 text-xs">{errors.company.message}</span>
            )}
          </div>

          {/* Botón Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#1E1F20] rounded-full text-primary ring-1 ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-secondary/20 hover:text-secondary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("investments_inside.form.button_sending")
                : t("investments_inside.form.button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}