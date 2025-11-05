import React, { useRef } from "react";
import send_button from "/assets/svg/send_button.svg";
import HoverAnimatedLink from "./helpers/HoverAnimatedLink";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation, Trans } from "react-i18next";
import AnimatedBackground from "./Background/AnimatedBackground";

const useFormSchema = () => {
  const { t, i18n } = useTranslation();

  return z.object({
    username: z.string().min(2, {
      message: t("validation.username_min"),
    }),
    email: z
      .string()
      .email(t("validation.email_invalid"))
      .min(2, {
        message: t("validation.email_min"),
      }),
    phone: z.string().min(6, {
      message: t("validation.phone_min"),
    }),
    findUs: z.string().min(3, {
      message: t("validation.findUs_min"),
    }),
    investingWithUs: z
      .string()
      .min(1, { message: t("validation.investingWithUs_min") }),

    message: z.string().min(10, {
      message: t("validation.message_min"),
    }),
    terms: z.literal(true, {
      errorMap: () => ({ message: t("validation.terms_required") }),
    }),
  });
};

const HomeFooter = () => {
  const formSchema = useFormSchema();
  const { t } = useTranslation();
  const formRef = useRef(null);
  const sectionRef = useRef();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      findUs: "",
      investingWithUs: "", // 👈 nuevo campo
      message: "",
      terms: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true); // 👈 activar "Sending..."

    const payload = {
      first_name: data.username,
      email: data.email,
      phone: data.phone,
      source: data.findUs,
      investment_reason: data.investingWithUs,
      message: data.message,
    };

    try {
      const response = await fetch(
        "https://services.leadconnectorhq.com/hooks/7oU5lsceedkFIPHBdU4t/webhook-trigger/42cc89b9-01f4-4254-b293-216594ae72de",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (error) {
      toast.error(t("form_send.fail_title"));
    }

    try {
      if (formRef.current) {
        await emailjs.sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          formRef.current,
          {
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          }
        );
      }
      reset(); // Limpia los campos
      toast.success(t("form_send.success_title"), {
        description: t("form_send.success"),
      });
    } catch (error) {
      toast.error(t("form_send.fail_title"));
    } finally {
      setIsSubmitting(false); // 👈 volver a "Send"
    }
  };

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="w-full h-auto  relative border-t border-dark_blue z-20 bg-primary bg-opacity-90 text-white_gray "
    >
      <div className="absolute inset-0 -z-10 opacity-80 bg-black" />
      <AnimatedBackground />
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row h-auto w-full lg:px-10">
          <div className="contact_wrapper relative p-8 flex flex-col justify-start items-start gap-2 w-full">
            <div className="w-full">
              <h3>{t("footer.phone")}</h3>
              <a
                href="tel:305-915-0002"
                className="text-dark_gray hover-underline-animation left"
              >
                305-915-0002
              </a>
            </div>
            <div className="w-full">
              <h3>{t("footer.email")}</h3>
              <a
                href="mailto:info@ddcdevelopments.com"
                className="text-sm hover-underline-animation left"
              >
                info@ddcdevelopments.com
              </a>
            </div>
            <div className="w-full">
              <h3>{t("footer.hoursLabel")}</h3>
              <a>{t("footer.hoursValue")}</a>
            </div>
            <div className="w-full">
              <h3>{t("footer.socialLabel")}</h3>
              <div className="flex flex-col">
                <a
                  href="https://www.instagram.com/ddc.developments"
                  className="hover-underline-animation left w-fit"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@DDC.Developments"
                  className="hover-underline-animation left w-fit"
                >
                  Youtube
                </a>
              </div>
            </div>
            <div className="w-full">
              <h3>{t("footer.addressLabel")}</h3>
              <a
                href="https://maps.app.goo.gl/5MWU4AVmGP8TjggM8"
                className="text-sm hover-underline-animation left"
              >
                3470 NW 82nd Ave, Suite 790
              </a>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.898282819486!2d-80.33319302573506!3d25.8069296067369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b97b64751fed%3A0xce335c3b7087bce8!2s3470%20NW%2082nd%20Ave%20suite%20790%2C%20Doral%2C%20FL%2033122%2C%20EE.%20UU.!5e0!3m2!1ses!2sca!4v1748334977167!5m2!1ses!2sca"
              className="lg:absolute lg:bottom-8 lg:left-8 w-full lg:w-[20rem] h-[20rem] mt-12 lg:mt-0 lg:h-60 rounded-xl"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps location of 3470 NW 82nd Ave, Suite 790, Doral, FL"
            />
          </div>
          <form
            id="contact_form"
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 px-8 py-6 "
          >
            <h1 className="font-bold text-5xl">{t("footer.title")}</h1>
            <h1 className="font-bold text-xl">{t("footer.subtitle")}</h1>
            <p className="text-sm">{t("footer.description")}</p>
            <div className="flex flex-col gap-1  ">
              <label>{t("footer.name")}</label>
              <input
                placeholder="Jane Smith"
                className="text-sm placeholder:pl-1 border p-1 rounded-xl text-dark_blue sm:w-3/4 lg:w-full"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-red-500 text-xs">
                  {errors.username.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 ">
              <label>{t("footer.email")}</label>
              <input
                placeholder={t("footer.emailPlaceHolder")}
                className="text-sm placeholder:pl-1 border p-1 rounded-xl text-dark_blue sm:w-3/4 lg:w-full"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1  ">
              <label>{t("footer.phone")}</label>
              <input
                placeholder="305-555-1234"
                className="text-sm placeholder:pl-1 border p-1 rounded-xl text-dark_blue sm:w-3/4 lg:w-full "
                {...register("phone")}
              />
              {errors.phone && (
                <span className="text-red-500 text-xs">
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label>{t("footer.findUs")}</label>
              <input
                placeholder="Instagram, Youtube..."
                className="text-sm placeholder:pl-1 border p-1 rounded-xl resize-none text-dark_blue "
                {...register("findUs")}
              />
              {errors.findUs && (
                <span className="text-red-500 text-xs">
                  {errors.findUs.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 font-light">
              <label htmlFor="investingWithUs">{t("footer.reason")}</label>
              <div className="border-fade-top border-fade-bottom relative flex flex-col gap-1 pl-1 py-3">
                <select
                  id="investingWithUs"
                  {...register("investingWithUs")}
                  className="border border-gray-300 rounded-xl px-3 py-3 text-base text-dark_blue"
                  defaultValue="" // para forzar selección inicial vacía
                >
                  <option value="" disabled className="!text-slate-400">
                    {t("footer.reasonPlaceholder")}
                  </option>
                  <option value="Collaboration opportunities">
                    {t("contact_reasons.collaboration")}
                  </option>
                  <option value="General inquiries">
                    {t("contact_reasons.inquiries")}
                  </option>
                  <option value="Business proposals">
                    {t("contact_reasons.business")}
                  </option>
                  <option value="Other"> {t("contact_reasons.other")}</option>
                </select>
              </div>

              {errors.investingWithUs && (
                <span className="text-red-500 text-xs">
                  {errors.investingWithUs.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label>{t("footer.message")}</label>
              <textarea
                placeholder={t("footer.messagePlaceHolder")}
                className="text-sm placeholder:pl-1 border p-2 rounded-xl resize-none text-dark_blue w-full"
                {...register("message")}
              />
              {errors.message && (
                <span className="text-red-500 text-xs">
                  {errors.message.message}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                {...register("terms")}
              />
              <label className="text-sm font-normal">
                {t("footer.acceptPolicy")}
                {"  "}
                <a href="/privacy-policy" className="font-bold" target="_blank">
                  {t("footer.privacyPolicy")}
                </a>
              </label>
            </div>
            {errors.terms && (
              <span className="text-red-500 text-xs">
                {errors.terms.message}
              </span>
            )}
            {/* hidden inputs for emailjs */}
            <input type="hidden" name="username" />
            <input type="hidden" name="email" />
            <input type="hidden" name="findUs" />
            <input type="hidden" name="investingWithUs" />
            <input type="hidden" name="phone" />
            <input type="hidden" name="message" />
            <button
              type="submit"
              className="self-start flex items-center bg-dark_grey rounded-3xl p-1 pl-3 text-xl disabled:opacity-50 mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("footer.sending") : t("footer.send")}
              <img
                className="w-auto h-10 lg:h-7"
                src={send_button}
                alt="send"
              />
            </button>
          </form>
          <div className="md:hidden border-fade-top footer_banner relative w-full px-4 py-2 bottom-0 flex justify-between items-center">
            <a href="/">
              All Rigths
              <br /> Reserved
            </a>

            <a href="/privacy-policy" target="_blank">
              {t("footer.privacyPolicy")}
            </a>
          </div>
        </div>
        <div className="hidden footer_banner mt-20 border-fade-top relative w-full px-8 py-2 bottom-0 md:flex justify-between items-center">
          <a className="border-dark_blue">All Rigths Reserved</a>

          <HoverAnimatedLink
            text={t("footer.privacyPolicy")}
            target="_blank"
            href={"/privacy-policy"}
            className="border-b border-dark_blue"
          />
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
