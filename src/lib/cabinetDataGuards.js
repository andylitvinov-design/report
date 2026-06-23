const rawBackendPatterns = [
  /profile_cabinet_service_orders/i,
  /client_profile_id/i,
  /column .* does not exist/i,
  /supabase|postgres|postgrest|sql/i,
];

export function isRawBackendError(value) {
  if (!value) {
    return false;
  }

  const message = typeof value === "string" ? value : value.message || String(value);
  return rawBackendPatterns.some((pattern) => pattern.test(message));
}

export function getFriendlyCabinetError(value, fallback = "Данные временно недоступны. Попробуйте обновить раздел позже.") {
  if (!value) {
    return "";
  }

  if (isRawBackendError(value)) {
    return fallback;
  }

  return typeof value === "string" ? value : value.message || fallback;
}
