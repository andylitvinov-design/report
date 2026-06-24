import { getMasterPlan, getMasterPlanLimits } from "./masterPlans.js";

function usageCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

function allow(message) {
  return { allowed: true, message };
}

function block(message) {
  return { allowed: false, message };
}

function underLimit(planId, currentCount, limitKey, allowedMessage, blockedMessage) {
  const limits = getMasterPlanLimits(planId);
  const limit = limits[limitKey];
  if (usageCount(currentCount) < limit) return allow(allowedMessage(limit));
  return block(blockedMessage(limit));
}

export function canCreateTemplate(planId, currentTemplateCount = 0) {
  return underLimit(
    planId,
    currentTemplateCount,
    "maxPlaceTemplates",
    (limit) => `Можно сохранить шаблон. Лимит режима: ${limit}.`,
    (limit) => `Лимит шаблонов для этого режима уже достигнут: ${limit}. Старые шаблоны не удаляются, но новый сохранить нельзя.`,
  );
}

export function canUploadPhotoToday(planId, uploadsToday = 0) {
  return underLimit(
    planId,
    uploadsToday,
    "dailyPhotoUploads",
    (limit) => `Можно загрузить фото сегодня. Дневной лимит: ${limit}.`,
    (limit) => `Дневной лимит загрузки фото уже достигнут: ${limit}. Попробуйте завтра или смените режим.`,
  );
}

export function canCreateClient(planId, currentClientCount = 0) {
  return underLimit(
    planId,
    currentClientCount,
    "maxClients",
    (limit) => `Можно добавить клиента. Лимит режима: ${limit}.`,
    (limit) => `Лимит клиентов для этого режима уже достигнут: ${limit}. Существующие клиенты сохраняются.`,
  );
}

export function canCreateService(planId, currentServiceCount = 0) {
  const plan = getMasterPlan(planId);
  if (!plan.servicesEnabled) {
    return block("В режиме Start услуги недоступны. Можно подготовить профиль и шаблоны, но не размещать услуги.");
  }
  if (usageCount(currentServiceCount) < plan.freeTrialServicesLimit) {
    return allow(`Можно разместить бесплатную пробную услугу. Лимит режима: ${plan.freeTrialServicesLimit}.`);
  }
  return block(`Лимит бесплатных пробных услуг уже достигнут: ${plan.freeTrialServicesLimit}.`);
}

export function canCreatePaidService(planId, currentPaidOrPlacedCount = 0) {
  const plan = getMasterPlan(planId);
  if (!plan.paidServicesEnabled) {
    return block("Платные услуги доступны только в режиме Master.");
  }
  if (usageCount(currentPaidOrPlacedCount) < plan.maxPaidOrPlacedUnits) {
    return allow(`Можно разместить платную услугу. Лимит контролируемых единиц: ${plan.maxPaidOrPlacedUnits}.`);
  }
  return block(`Лимит платных или размещённых единиц уже достигнут: ${plan.maxPaidOrPlacedUnits}.`);
}

export function canHidePublication(planId, hiddenPublicationCount = 0) {
  const plan = getMasterPlan(planId);
  if (!plan.canHidePublications) {
    return block("Скрытие публикаций доступно только в режиме Master.");
  }
  if (usageCount(hiddenPublicationCount) < plan.maxHiddenPublications) {
    return allow(`Можно скрыть публикацию. Лимит скрытых публикаций: ${plan.maxHiddenPublications}.`);
  }
  return block(`Лимит скрытых публикаций уже достигнут: ${plan.maxHiddenPublications}.`);
}
