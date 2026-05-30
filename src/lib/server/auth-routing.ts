export function resolveSafeNextPath(value: string | null | undefined, fallback = "/cabinet") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback
  return value
}

export function getCabinetRedirectTarget(pathname: string, isAuthenticated: boolean) {
  if (isAuthenticated) return null
  const next = resolveSafeNextPath(pathname, "/cabinet")
  return `/login?next=${encodeURIComponent(next)}`
}
