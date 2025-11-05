import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import emailjs from "@emailjs/browser"; // npm i @emailjs/browser

export function InvestmentDialog({ open, onClose, investmentTitle }) {
  const panelRef = useRef(null);
  const { t } = useTranslation();

  /* -------------------- Dialog con Zod + RHF + EmailJS -------------------- */
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
      .regex(
        /^[0-9+()\-\s]{7,20}$/,
        t("investments_inside.form.validation.phone")
      ),
    // ✅ nuevos campos obligatorios
    budget: z.string().min(1, t("investments_inside.form.validation.select")),
    funds: z.string().min(1, t("investments_inside.form.validation.select")),
    company: z.string().min(1, t("investments_inside.form.validation.select")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dialogSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      budget: "",
      funds: "",
      company: "",
    },
  });

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
      budget: data.budget,
      funds: data.funds,
      company: data.company,
      source: "investments_inside1_dialog",
    };
    try {
      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/7oU5lsceedkFIPHBdU4t/webhook-trigger/88dfb46e-d9cd-4d8b-84c9-98fe4e2ea450",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(templateParams),
        }
      );
    } catch (error) {
      toast.error(t("form_send.fail_title"));
    }
    try {
      // ✅ Armar el mensaje para WhatsApp
      const phoneNumber = "17865661632"; // Número WhatsApp de la empresa (sin +, con código de país)
      const message = `
Hola, me gustaría recibir más información sobre inversiones.

📌 *Datos proporcionados:*
- Nombre: ${data.name}
- Email: ${data.email}
- Teléfono: ${data.phone}
- Presupuesto estimado: ${data.budget}
- Fondos disponibles: ${data.funds}
- Empresa registrada en Estados Unidos?: ${data.company}
    `.trim();

      // ✅ Crear URL de WhatsApp correctamente codificada
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

      // ✅ Redirigir (compatible con móvil, desktop, app, navegador)
      window.location.href = whatsappURL;

      // ✅ Cerrar modal y resetear formulario (si aplica)
      onClose?.();
      reset();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo iniciar WhatsApp", {
        description: "Intenta nuevamente o verifica tu dispositivo.",
      });
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
      aria-labelledby="investment-dialog-title"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[92vw] max-w-[520px] max-h-[90vh] overflow-y-auto bg-primary text-secondary p-6 sm:p-8 shadow-2xl rounded-none"
      >
        {/* Cerrar */}
        <button
          aria-label="Cerrar"
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
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h3
          id="investment-dialog-title"
          className="text-2xl font-semibold tracking-tight"
        >
          {t("investments_inside.form.title")}
        </h3>
        <p className="mt-1 text-sm opacity-80">
          {t("investments_inside.form.subtitle")}
          <span className="font-medium">{investmentTitle}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-xs uppercase tracking-wide opacity-80"
            >
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
              <span className="text-rose-400 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-wide opacity-80"
            >
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
              <span className="text-rose-400 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phone"
              className="text-xs uppercase tracking-wide opacity-80"
            >
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
              <span className="text-rose-400 text-xs">
                {errors.phone.message}
              </span>
            )}
          </div>
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
                <label key={opt} className="flex items-center gap-2">
                  <input type="radio" value={opt} {...register("budget")} />
                  {opt}
                </label>
              ))}
            </div>
            {errors.budget && (
              <span className="text-rose-400 text-xs">
                {errors.budget.message}
              </span>
            )}
          </div>

          {/* Pregunta 2 */}
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
                <label key={opt} className="flex items-center gap-2">
                  <input type="radio" value={opt} {...register("funds")} />
                  {opt}
                </label>
              ))}
            </div>
            {errors.funds && (
              <span className="text-rose-400 text-xs">
                {errors.funds.message}
              </span>
            )}
          </div>

          {/* Pregunta 3 */}
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
                <label key={opt} className="flex items-center gap-2">
                  <input type="radio" value={opt} {...register("company")} />
                  {opt}
                </label>
              ))}
            </div>
            {errors.company && (
              <span className="text-rose-400 text-xs">
                {errors.company.message}
              </span>
            )}
          </div>

          {/* Botón */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-[#1E1F20] rounded-full text-primary ring-1 ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-secondary/20 hover:text-secondary transition-colors duration-200 disabled:opacity-60"
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
