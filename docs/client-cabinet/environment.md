# Client Cabinet Environment

The cabinet is a Next 16 App Router application. It supports two runtime modes.

## Local development fallback

When Supabase variables are absent and `NODE_ENV` is not `production`, `/auth/google` creates a dev-only HTTP-only cookie session and redirects to the requested cabinet path. This mode is only for local smoke checks and does not represent production security.

## Production Google and Supabase auth

Production requires Supabase Auth with Google enabled, the database schema applied, and deployment environment variables configured.

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public browser-safe Supabase values. `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` must remain server-side deployment secrets.

Apply `supabase/schema.sql` before using persisted production history. The app performs server-side data access and filters cabinet data by the authenticated user id; RLS is enabled in the schema as a database safety boundary.

Do not commit real environment values.
