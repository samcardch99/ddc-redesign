// InvestmentCards.jsx
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Card individual
 * Props:
 * - title
 * - asset_type
 * - construction_term
 * - investor_profile
 * - onAction (func) -> click del botón
 * - className (opcional)
 */
export function InvestmentCard({
  title,
  asset_type,
  construction_term,
  investor_profile,
  onAction,
  className = "",
}) {
  const { t } = useTranslation();
  return (
    <article
      className={`relative w-4/5  min-h-fit  p-4
      bg-primary
      ring-1 ring-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      text-secondary ${className}`}
    >
      <div className="flex flex-col justify-between h-full">
        <h3 className="font-semibold text-lg border-b border-secondary">
          {title}
        </h3>

        {/* corregido: text-text-lg -> text-base */}
        <div className="mt-3 space-y-3 text-base leading-5">
          <div>
            <p className="uppercase tracking-wide text-secondary font-semibold text-sm">
              {t("investments_inside.card.active")}
            </p>
            <p className="text-secondary text-xs">{asset_type}</p>
          </div>
          <div>
            <p className="uppercase tracking-wide text-secondary font-semibold text-sm">
              {t("investments_inside.card.time")}
            </p>
            <p className="text-secondary text-xs">{construction_term}</p>
          </div>
          <div>
            <p className="uppercase tracking-wide text-secondary font-semibold text-sm">
              {t("investments_inside.card.profile")}
            </p>
            <p className="text-secondary text-xs">{investor_profile}</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={onAction}
            className="mt-4 inline-flex items-center justify-center w-[170px]
              rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200
              bg-[#1E1F20] hover:bg-secondary/20 hover:text-secondary active:bg-secondary/25 active:text-secondary
              shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]
              ring-1 ring-white/20 text-primary"
          >
            {t("investments_inside.card.button")}
          </button>
        </div>
      </div>

      <span className="absolute left-0 top-8 h-4 w-[2px] bg-white/25 rounded-r-sm" />
    </article>
  );
}

/**
 * Grid que mapea las cards
 * Props:
 * - items: Array<{ title, asset_type, construction_term, investor_profile }>
 * - onAction: (item) => void
 * - className (opcional)
 */
export function InvestmentCardsGrid({ items = [], onAction, className = "" }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 ${className}`}
    >
      {items.map((item, idx) => (
        <InvestmentCard
          key={item.id ?? item.title ?? idx}
          title={item.title}
          asset_type={item.asset_type}
          construction_term={item.construction_term}
          investor_profile={item.investor_profile}
          onAction={() => onAction?.(item)}
        />
      ))}
    </div>
  );
}

/* ---------------------------
   Ejemplo de uso
----------------------------*/

// Puedes mover esto a tu archivo data.json
export const sampleData = [
  // {
  //   id: "pg-select",
  //   title: "Punta Gorda Select",
  //   asset_type: "Single family home",
  //   construction_term: "9 meses después de permisos",
  //   investor_profile: "Inversor doméstico / internacional",
  // },
  // {
  //   id: "pg-premium",
  //   title: "Punta Gorda Premium",
  //   asset_type: "Single family home",
  //   construction_term: "9 meses después de permisos",
  //   investor_profile: "Inversor doméstico / internacional",
  // },
  {
    id: "miami-premium",
    title: "Miami Premium ",
    asset_type: "Single family home (6000 sqft)",
    construction_term: "12 meses después de permisos",
    investor_profile: "Inversor doméstico / internacional",
  },
  {
    id: "miami-pinecrest",
    title: "Miami Lux",
    asset_type: "Single family home (7000 sqft)",
    construction_term: "12 meses después de permisos",
    investor_profile: "Inversor doméstico / internacional",
  },
];

// En tu página/componente
export function DemoSection() {
  const handleAction = (item) => {
    // aquí integras tu modal, link a calendario, WhatsApp, etc.
    console.log("Talk to an advisor →", item.title);
  };

  return (
    <section className="w-full py-10 bg-[#0b0f14] flex items-center justify-center">
      <InvestmentCardsGrid items={sampleData} onAction={handleAction} />
    </section>
  );
}
