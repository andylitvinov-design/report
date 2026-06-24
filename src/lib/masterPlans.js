export const MASTER_PLAN_IDS = {
  START: "start",
  PRACTIC: "practic",
  MASTER: "master",
};

export const masterPlans = [
  {
    id: MASTER_PLAN_IDS.START,
    title: "Start",
    priceMonthlyEur: 0,
    description: "Базовый режим для старта без услуг и платных публикаций.",
    maxPlaceTemplates: 7,
    dailyPhotoUploads: 7,
    maxClients: 5,
    servicesEnabled: false,
    freeTrialServicesLimit: 0,
    paidServicesEnabled: false,
    canHidePublications: false,
    maxHiddenPublications: 0,
    maxPaidOrPlacedUnits: 0,
  },
  {
    id: MASTER_PLAN_IDS.PRACTIC,
    title: "Practic",
    priceMonthlyEur: 10,
    description: "Рабочий режим для практикующего мастера с пробными бесплатными услугами.",
    maxPlaceTemplates: 25,
    dailyPhotoUploads: 20,
    maxClients: 10,
    servicesEnabled: true,
    freeTrialServicesLimit: 3,
    paidServicesEnabled: false,
    canHidePublications: false,
    maxHiddenPublications: 0,
    maxPaidOrPlacedUnits: 3,
  },
  {
    id: MASTER_PLAN_IDS.MASTER,
    title: "Master",
    priceMonthlyEur: 25,
    description: "Полный режим для платных услуг, скрытия публикаций и расширенной клиентской базы.",
    maxPlaceTemplates: 50,
    dailyPhotoUploads: 40,
    maxClients: 25,
    servicesEnabled: true,
    freeTrialServicesLimit: 10,
    paidServicesEnabled: true,
    canHidePublications: true,
    maxHiddenPublications: 10,
    maxPaidOrPlacedUnits: 10,
  },
];

const masterPlanMap = new Map(masterPlans.map((plan) => [plan.id, plan]));

export function normalizeMasterPlanId(planId) {
  const normalized = String(planId || "").trim().toLowerCase();
  return masterPlanMap.has(normalized) ? normalized : MASTER_PLAN_IDS.START;
}

export function getMasterPlan(planId) {
  return masterPlanMap.get(normalizeMasterPlanId(planId)) || masterPlanMap.get(MASTER_PLAN_IDS.START);
}

export function getMasterPlanLimits(planId) {
  const plan = getMasterPlan(planId);
  return {
    maxPlaceTemplates: plan.maxPlaceTemplates,
    dailyPhotoUploads: plan.dailyPhotoUploads,
    maxClients: plan.maxClients,
    servicesEnabled: plan.servicesEnabled,
    freeTrialServicesLimit: plan.freeTrialServicesLimit,
    paidServicesEnabled: plan.paidServicesEnabled,
    canHidePublications: plan.canHidePublications,
    maxHiddenPublications: plan.maxHiddenPublications,
    maxPaidOrPlacedUnits: plan.maxPaidOrPlacedUnits,
  };
}
