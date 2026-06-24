import React from "react";
import {
  canCreateClient,
  canCreatePaidService,
  canCreateService,
  canCreateTemplate,
  canHidePublication,
  canUploadPhotoToday,
} from "../lib/masterPlanEntitlements.js";
import { MASTER_PLAN_IDS, masterPlans } from "../lib/masterPlans.js";

const preparedActions = [
  {
    id: "templates",
    label: "Шаблоны мест силы",
    check(planId) {
      return canCreateTemplate(planId, 0);
    },
  },
  {
    id: "photos",
    label: "Фото в день",
    check(planId) {
      return canUploadPhotoToday(planId, 0);
    },
  },
  {
    id: "clients",
    label: "Клиенты",
    check(planId) {
      return canCreateClient(planId, 0);
    },
  },
  {
    id: "services",
    label: "Бесплатные услуги",
    check(planId) {
      return canCreateService(planId, 0);
    },
  },
  {
    id: "paid-services",
    label: "Платные услуги",
    check(planId) {
      return canCreatePaidService(planId, 0);
    },
  },
  {
    id: "hidden-publications",
    label: "Скрытие публикаций",
    check(planId) {
      return canHidePublication(planId, 0);
    },
  },
];

function paymentLinkForPlan(planId) {
  if (planId === MASTER_PLAN_IDS.PRACTIC) return import.meta.env?.VITE_PRACTIC_PAYMENT_LINK || "";
  if (planId === MASTER_PLAN_IDS.MASTER) return import.meta.env?.VITE_MASTER_PAYMENT_LINK || "";
  return "";
}

function formatPlanPrice(plan) {
  return plan.priceMonthlyEur === 0 ? "0 €/мес" : `${plan.priceMonthlyEur} €/мес`;
}

function PlanLimitList({ plan }) {
  return (
    <ul className="master-plan-limits">
      <li>{plan.maxPlaceTemplates} шаблонов мест силы</li>
      <li>{plan.dailyPhotoUploads} фото в день</li>
      <li>{plan.maxClients} клиентов</li>
      <li>{plan.servicesEnabled ? `${plan.freeTrialServicesLimit} бесплатных услуг` : "услуги недоступны"}</li>
      <li>{plan.paidServicesEnabled ? "платные услуги доступны" : "платные услуги закрыты"}</li>
      <li>{plan.canHidePublications ? `${plan.maxHiddenPublications} скрытых публикаций` : "скрытие публикаций закрыто"}</li>
    </ul>
  );
}

export default function MasterPlanSwitcher({ masterPlanId = MASTER_PLAN_IDS.START, onPlanChange }) {
  return (
    <article className="card settings-card master-plan-section">
      <div className="master-plan-heading">
        <div>
          <p className="eyebrow">Режим мастера</p>
          <h2>Start / Practic / Master</h2>
          <p className="settings-note">
            Это отдельный режим кабинета мастера. Он не смешивается с клиентскими пакетами доступа ниже.
          </p>
        </div>
        <span className="master-plan-current">
          Текущий режим: {masterPlans.find((plan) => plan.id === masterPlanId)?.title || "Start"}
        </span>
      </div>

      <div className="master-plan-grid" aria-label="Тарифы кабинета мастера">
        {masterPlans.map((plan) => {
          const isCurrent = plan.id === masterPlanId;
          const paymentLink = paymentLinkForPlan(plan.id);

          return (
            <section className={isCurrent ? "master-plan-card active" : "master-plan-card"} key={plan.id}>
              <div className="master-plan-card-head">
                <span>{plan.title}</span>
                <strong>{formatPlanPrice(plan)}</strong>
              </div>
              <p>{plan.description}</p>
              <PlanLimitList plan={plan} />
              <div className="master-plan-actions">
                <button
                  className={isCurrent ? "secondary-btn" : "primary-btn"}
                  type="button"
                  onClick={() => onPlanChange?.(plan.id)}
                >
                  {isCurrent ? "Текущий режим" : "Сохранить режим"}
                </button>
                {plan.priceMonthlyEur > 0 ? (
                  paymentLink ? (
                    <a className="secondary-btn master-plan-pay-link" href={paymentLink} rel="noreferrer" target="_blank">
                      Перейти к оплате
                    </a>
                  ) : (
                    <span className="master-plan-payment-note">Ссылка оплаты ещё не подключена.</span>
                  )
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <div className="master-plan-guard-panel">
        <h3>Лимиты подготовлены для действий</h3>
        <div className="master-plan-guard-grid">
          {preparedActions.map((action) => {
            const result = action.check(masterPlanId);
            return (
              <div className={result.allowed ? "master-plan-guard allowed" : "master-plan-guard blocked"} key={action.id}>
                <span>{action.label}</span>
                <strong>{result.allowed ? "готово" : "ограничено"}</strong>
                <p>{result.message}</p>
              </div>
            );
          })}
        </div>
        <p className="master-plan-prepared-note">
          Эти проверки уже готовы для шаблонов, фото, клиентов, услуг и скрытия публикаций. Если действие ещё не
          подключено в интерфейсе, лимит подготовлен и не удаляет существующий контент при превышении.
        </p>
      </div>
    </article>
  );
}
