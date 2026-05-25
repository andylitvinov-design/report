# Client Cabinet Environment

The cabinet supports two modes:

1. Dev fallback mode: no external auth provider is configured. The Google button creates a local development session for UI and routing checks.
2. Production auth mode: configure Supabase project URL and public anon key in the deployment environment.

Required deployment variables:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Optional server-side variables for the future service layer:

- SUPABASE_SERVICE_ROLE_KEY
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

Do not commit real values to the repository.
Apply `supabase/schema.sql` before using persisted production history.
